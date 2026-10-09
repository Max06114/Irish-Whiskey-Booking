"""
Email Service using Resend
Handles all transactional emails with safety guardrails.
"""

import os
import re
import ipaddress
import logging
import httpx
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

# Resend API Configuration
EMAIL_BASE_URL = "https://api.resend.com"
EMAIL_KEY = os.environ.get("RESEND_API_KEY")
EMAIL_FROM = os.environ.get("EMAIL_FROM", "info@travel-events.de")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "Travel Events")
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "info@travel-events.de")

# Guardrail constants
_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    """Reject empty, punycode, IP-literal, and shortener hosts."""
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    """Check if domains share registrable domain."""
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    """Parse and validate email HTML for security."""
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []
    
    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []
    
    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)
    
    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    """Validate email content against security guardrails."""
    scan = _EmailScan()
    scan.feed(html)
    
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks for credentials: {p!r} (G2)")
    
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Links must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Invalid URL: {url!r} (G3)")
    
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} ≠ link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str, reply_to: str | None = None, 
                     attachment: bytes | None = None, attachment_filename: str | None = None) -> str | None:
    """
    Send email via Resend API.
    
    Args:
        to: Recipient email address
        subject: Email subject
        html: HTML content (from server-side template only)
        reply_to: Optional reply-to address
        attachment: Optional PDF/file attachment as bytes
        attachment_filename: Name for the attachment
    
    Returns:
        Email ID if successful, None otherwise
    """
    if not EMAIL_KEY:
        logger.error("RESEND_API_KEY not configured")
        return None
    
    _assert_safe_email(subject, html)
    
    payload = {
        "from": f"{EMAIL_FROM_NAME} <{EMAIL_FROM}>",
        "to": [to],
        "subject": subject,
        "html": html
    }
    
    if reply_to or EMAIL_REPLY_TO:
        payload["reply_to"] = [reply_to or EMAIL_REPLY_TO]
    
    # Add attachment if provided
    if attachment and attachment_filename:
        import base64
        payload["attachments"] = [{
            "filename": attachment_filename,
            "content": base64.b64encode(attachment).decode('utf-8')
        }]
    
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{EMAIL_BASE_URL}/emails",
                headers={
                    "Authorization": f"Bearer {EMAIL_KEY}",
                    "Content-Type": "application/json"
                },
                json=payload,
            )
        resp.raise_for_status()
        result = resp.json()
        logger.info(f"Email sent successfully to {to}: {result.get('id')}")
        return result.get("id")
    except httpx.HTTPStatusError as e:
        logger.error(f"Email send failed: {e.response.status_code} {e.response.text}")
        return None
    except Exception as e:
        logger.error(f"Email send error: {str(e)}")
        return None


# Email Templates

def booking_confirmation_email(booking_data: dict) -> tuple[str, str]:
    """Generate booking confirmation email (German)."""
    subject = f"Buchungsbestätigung - Irish Whiskey Tour {booking_data.get('check_in', '')}"
    
    guest_name = escape(booking_data.get("guest_name", ""))
    booking_id = escape(booking_data.get("id", ""))
    check_in = escape(booking_data.get("check_in", ""))
    check_out = escape(booking_data.get("check_out", ""))
    room_type = escape(booking_data.get("room_type_display", ""))
    guests_count = escape(str(booking_data.get("guests_count", 1)))
    total_price = escape(f"{booking_data.get('total_price', 0):.2f}")
    
    html = f'''
    <table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#fff">
        <tr>
            <td style="padding:40px 24px;font-family:Arial,sans-serif;background:#74CF6C;color:#fff">
                <h1 style="margin:0;font-size:28px">Vielen Dank für Ihre Buchung!</h1>
            </td>
        </tr>
        <tr>
            <td style="padding:32px 24px;font-family:Arial,sans-serif">
                <p style="font-size:16px;line-height:1.6;margin:0 0 16px">
                    Hallo {guest_name},
                </p>
                <p style="font-size:16px;line-height:1.6;margin:0 0 24px">
                    Ihre Buchung für die <strong>Irish Whiskey Natur & Kultur Entdeckungsreise</strong> wurde erfolgreich bestätigt!
                </p>
                
                <table style="width:100%;border:2px solid #E6DEC8;border-radius:8px;margin:0 0 24px">
                    <tr style="background:#F9F7F0">
                        <td colspan="2" style="padding:16px;border-bottom:1px solid #E6DEC8">
                            <strong style="font-size:18px;color:#1D1D1D">Buchungsdetails</strong>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:12px 16px;border-bottom:1px solid #E6DEC8;color:#5A544C">Buchungsnummer:</td>
                        <td style="padding:12px 16px;border-bottom:1px solid #E6DEC8;font-weight:bold">{booking_id}</td>
                    </tr>
                    <tr>
                        <td style="padding:12px 16px;border-bottom:1px solid #E6DEC8;color:#5A544C">Anreise:</td>
                        <td style="padding:12px 16px;border-bottom:1px solid #E6DEC8;font-weight:bold">{check_in}</td>
                    </tr>
                    <tr>
                        <td style="padding:12px 16px;border-bottom:1px solid #E6DEC8;color:#5A544C">Abreise:</td>
                        <td style="padding:12px 16px;border-bottom:1px solid #E6DEC8;font-weight:bold">{check_out}</td>
                    </tr>
                    <tr>
                        <td style="padding:12px 16px;border-bottom:1px solid #E6DEC8;color:#5A544C">Zimmertyp:</td>
                        <td style="padding:12px 16px;border-bottom:1px solid #E6DEC8;font-weight:bold">{room_type}</td>
                    </tr>
                    <tr>
                        <td style="padding:12px 16px;border-bottom:1px solid #E6DEC8;color:#5A544C">Anzahl Gäste:</td>
                        <td style="padding:12px 16px;border-bottom:1px solid #E6DEC8;font-weight:bold">{guests_count}</td>
                    </tr>
                    <tr>
                        <td style="padding:12px 16px;color:#5A544C">Gesamtpreis:</td>
                        <td style="padding:12px 16px;font-size:20px;font-weight:bold;color:#74CF6C">{total_price} €</td>
                    </tr>
                </table>
                
                <p style="font-size:16px;line-height:1.6;margin:0 0 16px">
                    Wir freuen uns darauf, Sie auf dieser unvergesslichen Reise zu begleiten!
                </p>
                
                <div style="background:#F0FAF0;border-left:4px solid #74CF6C;padding:16px;margin:0 0 16px">
                    <p style="margin:0;font-size:14px;color:#1D1D1D">
                        📄 <strong>Rechnung im Anhang:</strong> Ihre Rechnung finden Sie als PDF-Datei im Anhang dieser E-Mail.
                    </p>
                </div>
                
                <div style="background:#F9F7F0;border:1px solid #E6DEC8;border-radius:8px;padding:16px;margin:0 0 16px">
                    <p style="margin:0 0 8px;font-size:14px;color:#1D1D1D">
                        <strong>📋 Wichtige Dokumente:</strong>
                    </p>
                    <p style="margin:0;font-size:14px;line-height:1.6;color:#5A544C">
                        • <a href="https://irish-whiskey-tour.travel-events.de/agb" style="color:#74CF6C;text-decoration:none">Allgemeine Geschäftsbedingungen (AGB)</a><br>
                        • <a href="https://irish-whiskey-tour.travel-events.de/datenschutz" style="color:#74CF6C;text-decoration:none">Datenschutzerklärung</a><br>
                        • <strong>Stornobedingungen:</strong> Bis 100 Tage kostenfrei, Details in den AGB
                    </p>
                </div>
                
                <p style="font-size:14px;line-height:1.6;margin:24px 0 0;padding-top:24px;border-top:1px solid #E6DEC8;color:#5A544C">
                    Bei Fragen erreichen Sie uns unter <a href="mailto:info@travel-events.de" style="color:#74CF6C">info@travel-events.de</a>
                </p>
                
                <p style="font-size:12px;color:#888;margin:16px 0 0">
                    Diese E-Mail wurde von {escape(EMAIL_FROM_NAME)} gesendet. Wir fragen niemals nach Passwörtern oder Kreditkartendaten per E-Mail.
                </p>
            </td>
        </tr>
    </table>
    '''
    
    return subject, html


def admin_notification_email(booking_data: dict) -> tuple[str, str]:
    """Generate admin notification email for new bookings."""
    subject = f"Neue Buchung: {booking_data.get('guest_name', '')} - {booking_data.get('id', '')}"
    
    guest_name = escape(booking_data.get("guest_name", ""))
    guest_email = escape(booking_data.get("email", ""))
    booking_id = escape(booking_data.get("id", ""))
    check_in = escape(booking_data.get("check_in", ""))
    room_type = escape(booking_data.get("room_type_display", ""))
    guests_count = escape(str(booking_data.get("guests_count", 1)))
    total_price = escape(f"{booking_data.get('total_price', 0):.2f}")
    payment_method = escape(booking_data.get("payment_method", ""))
    
    html = f'''
    <table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#fff">
        <tr>
            <td style="padding:40px 24px;font-family:Arial,sans-serif;background:#1D1D1D;color:#fff">
                <h1 style="margin:0;font-size:24px">🎉 Neue Buchung eingegangen!</h1>
            </td>
        </tr>
        <tr>
            <td style="padding:32px 24px;font-family:Arial,sans-serif">
                <table style="width:100%;border:2px solid #E6DEC8;border-radius:8px">
                    <tr style="background:#F9F7F0">
                        <td colspan="2" style="padding:16px;border-bottom:1px solid #E6DEC8">
                            <strong style="font-size:18px">Buchungsinformationen</strong>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:12px 16px;border-bottom:1px solid #E6DEC8;color:#5A544C;width:40%">Buchungs-ID:</td>
                        <td style="padding:12px 16px;border-bottom:1px solid #E6DEC8;font-weight:bold">{booking_id}</td>
                    </tr>
                    <tr>
                        <td style="padding:12px 16px;border-bottom:1px solid #E6DEC8;color:#5A544C">Gast:</td>
                        <td style="padding:12px 16px;border-bottom:1px solid #E6DEC8;font-weight:bold">{guest_name}</td>
                    </tr>
                    <tr>
                        <td style="padding:12px 16px;border-bottom:1px solid #E6DEC8;color:#5A544C">E-Mail:</td>
                        <td style="padding:12px 16px;border-bottom:1px solid #E6DEC8">{guest_email}</td>
                    </tr>
                    <tr>
                        <td style="padding:12px 16px;border-bottom:1px solid #E6DEC8;color:#5A544C">Anreise:</td>
                        <td style="padding:12px 16px;border-bottom:1px solid #E6DEC8;font-weight:bold">{check_in}</td>
                    </tr>
                    <tr>
                        <td style="padding:12px 16px;border-bottom:1px solid #E6DEC8;color:#5A544C">Zimmertyp:</td>
                        <td style="padding:12px 16px;border-bottom:1px solid #E6DEC8">{room_type}</td>
                    </tr>
                    <tr>
                        <td style="padding:12px 16px;border-bottom:1px solid #E6DEC8;color:#5A544C">Gäste:</td>
                        <td style="padding:12px 16px;border-bottom:1px solid #E6DEC8">{guests_count}</td>
                    </tr>
                    <tr>
                        <td style="padding:12px 16px;border-bottom:1px solid #E6DEC8;color:#5A544C">Zahlungsmethode:</td>
                        <td style="padding:12px 16px;border-bottom:1px solid #E6DEC8">{payment_method}</td>
                    </tr>
                    <tr>
                        <td style="padding:12px 16px;color:#5A544C">Gesamtpreis:</td>
                        <td style="padding:12px 16px;font-size:20px;font-weight:bold;color:#74CF6C">{total_price} €</td>
                    </tr>
                </table>
                
                <p style="font-size:14px;color:#5A544C;margin:24px 0 0">
                    Diese Buchung wurde automatisch erstellt. Bitte prüfen Sie die Details im Admin-Dashboard.
                </p>
            </td>
        </tr>
    </table>
    '''
    
    return subject, html


def payment_reminder_email(booking_data: dict) -> tuple[str, str]:
    """Generate payment reminder email."""
    subject = f"Zahlungserinnerung - Buchung {booking_data.get('id', '')}"
    
    guest_name = escape(booking_data.get("guest_name", ""))
    booking_id = escape(booking_data.get("id", ""))
    total_price = escape(f"{booking_data.get('total_price', 0):.2f}")
    
    html = f'''
    <table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#fff">
        <tr>
            <td style="padding:40px 24px;font-family:Arial,sans-serif;background:#FFA500;color:#fff">
                <h1 style="margin:0;font-size:28px">Zahlungserinnerung</h1>
            </td>
        </tr>
        <tr>
            <td style="padding:32px 24px;font-family:Arial,sans-serif">
                <p style="font-size:16px;line-height:1.6;margin:0 0 16px">
                    Hallo {guest_name},
                </p>
                <p style="font-size:16px;line-height:1.6;margin:0 0 24px">
                    dies ist eine freundliche Erinnerung bezüglich Ihrer Buchung <strong>{booking_id}</strong>.
                </p>
                
                <div style="background:#FFF9E6;border-left:4px solid #FFA500;padding:16px;margin:0 0 24px">
                    <p style="margin:0;font-size:18px;font-weight:bold;color:#1D1D1D">
                        Offener Betrag: {total_price} €
                    </p>
                </div>
                
                <p style="font-size:16px;line-height:1.6;margin:0 0 16px">
                    Bitte überweisen Sie den ausstehenden Betrag auf das angegebene Konto.
                </p>
                
                <p style="font-size:14px;line-height:1.6;margin:24px 0 0;padding-top:24px;border-top:1px solid #E6DEC8;color:#5A544C">
                    Bei Fragen erreichen Sie uns unter <a href="mailto:info@travel-events.de" style="color:#74CF6C">info@travel-events.de</a>
                </p>
                
                <p style="font-size:12px;color:#888;margin:16px 0 0">
                    Diese E-Mail wurde von {escape(EMAIL_FROM_NAME)} gesendet.
                </p>
            </td>
        </tr>
    </table>
    '''
    
    return subject, html


def payment_confirmation_email(booking_data: dict) -> tuple[str, str]:
    """Generate payment confirmation email."""
    subject = f"Zahlungsbestätigung - Buchung {booking_data.get('id', '')}"
    
    guest_name = escape(booking_data.get("guest_name", ""))
    booking_id = escape(booking_data.get("id", ""))
    amount = escape(f"{booking_data.get('total_price', 0):.2f}")
    
    html = f'''
    <table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#fff">
        <tr>
            <td style="padding:40px 24px;font-family:Arial,sans-serif;background:#74CF6C;color:#fff">
                <h1 style="margin:0;font-size:28px">✓ Zahlung erfolgreich</h1>
            </td>
        </tr>
        <tr>
            <td style="padding:32px 24px;font-family:Arial,sans-serif">
                <p style="font-size:16px;line-height:1.6;margin:0 0 16px">
                    Hallo {guest_name},
                </p>
                <p style="font-size:16px;line-height:1.6;margin:0 0 24px">
                    Ihre Zahlung für die Buchung <strong>{booking_id}</strong> wurde erfolgreich verarbeitet!
                </p>
                
                <div style="background:#F0FAF0;border-left:4px solid #74CF6C;padding:16px;margin:0 0 24px">
                    <p style="margin:0 0 8px;font-size:14px;color:#5A544C">Bezahlter Betrag:</p>
                    <p style="margin:0;font-size:24px;font-weight:bold;color:#74CF6C">
                        {amount} €
                    </p>
                </div>
                
                <p style="font-size:16px;line-height:1.6;margin:0 0 16px">
                    Ihre Reise ist nun vollständig bestätigt. Wir freuen uns darauf, Sie bald zu begrüßen!
                </p>
                
                <p style="font-size:14px;line-height:1.6;margin:24px 0 0;padding-top:24px;border-top:1px solid #E6DEC8;color:#5A544C">
                    Bei Fragen erreichen Sie uns unter <a href="mailto:info@travel-events.de" style="color:#74CF6C">info@travel-events.de</a>
                </p>
                
                <p style="font-size:12px;color:#888;margin:16px 0 0">
                    Diese E-Mail wurde von {escape(EMAIL_FROM_NAME)} gesendet.
                </p>
            </td>
        </tr>
    </table>
    '''
    
    return subject, html
