"""
Pydantic Models for Irish Whiskey Trip Booking API
"""
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict
from datetime import datetime, timezone
import uuid


class TripInventory(BaseModel):
    """Inventory for the trip - person-based capacity."""
    total_capacity: int = 20  # Max 20 participants
    booked_participants: int = 0  # Current bookings


class Trip(BaseModel):
    """Single trip package (Irish Whiskey Tour)"""
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str  # "Irish Whiskey Natur & Kultur Entdeckungsreise"
    description: str
    start_date: str  # "2027-05-18"
    end_date: str  # "2027-05-25"
    duration_days: int = 8
    duration_nights: int = 7
    # Pricing per person
    price_per_person_double: float = 2600.0
    price_per_person_twin: float = 2600.0
    price_per_person_single: float = 3300.0
    single_supplement: float = 700.0
    price_per_person_shared: float = 2600.0  # Half double room with partner assignment
    # Capacity
    max_participants: int = 20
    inventory: TripInventory = Field(default_factory=lambda: TripInventory(total_capacity=20, booked_participants=0))
    # Trip details
    hotels: List[Dict] = []  # [{location: "Dublin", nights: 2, stars: "3-4"}, ...]
    inclusions: List[str] = []
    active: bool = True
    auto_deactivated: bool = False  # When sold out
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class TripCreate(BaseModel):
    name: str
    description: str
    start_date: str
    end_date: str
    duration_days: int = 8
    duration_nights: int = 7
    price_per_person_double: float = 2600.0
    price_per_person_twin: float = 2600.0
    price_per_person_single: float = 3300.0
    single_supplement: float = 700.0
    price_per_person_shared: float = 2600.0
    max_participants: int = 20
    hotels: List[Dict] = []
    inclusions: List[str] = []
    active: bool = True


# Legacy Hotel models - keeping for potential future multi-hotel support
class RoomInventory(BaseModel):
    """Room inventory for a hotel. 
    For flexible hotels (like Dorint), rooms can be used as single/double/twin from a pool.
    """
    # Fixed room types (B&B, Ankerhof style)
    single: int = 0  # Dedicated single rooms
    double: int = 0  # Dedicated double rooms
    twin: int = 0    # Dedicated twin rooms
    # Pool-based inventory (Dorint style - flexible usage)
    standard_pool: int = 0  # Can be used as single, double, or twin
    comfort_pool: int = 0   # Can be used as single_comfort, double_comfort, or twin_comfort


class Hotel(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    name_en: str
    description: str
    description_en: str
    stars: int = 4
    address: str
    distance_to_venue: str
    distance_to_venue_en: str
    amenities: List[str] = []
    amenities_en: List[str] = []
    images: List[str] = []
    image_ids: List[str] = []
    single_price: float
    double_price: float
    twin_price: Optional[float] = None
    # Comfort room prices (optional - for hotels with multiple categories)
    single_comfort_price: Optional[float] = None
    double_comfort_price: Optional[float] = None
    twin_comfort_price: Optional[float] = None
    has_comfort_rooms: bool = False
    # Inventory management
    inventory: Optional[RoomInventory] = None
    inventory_type: str = "fixed"  # "fixed" (dedicated rooms) or "pool" (flexible usage)
    breakfast_included: bool = True
    tax_included: bool = True
    active: bool = True
    auto_deactivated: bool = False
    sort_order: Optional[int] = None  # For manual sorting
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class HotelCreate(BaseModel):
    name: str
    name_en: str
    description: str
    description_en: str
    stars: int = 4
    address: str
    distance_to_venue: str
    distance_to_venue_en: str
    amenities: List[str] = []
    amenities_en: List[str] = []
    images: List[str] = []
    single_price: float
    double_price: float
    twin_price: Optional[float] = None
    single_comfort_price: Optional[float] = None
    double_comfort_price: Optional[float] = None
    twin_comfort_price: Optional[float] = None
    has_comfort_rooms: bool = False
    inventory: Optional[Dict] = None
    inventory_type: str = "fixed"
    breakfast_included: bool = True
    tax_included: bool = True
    active: bool = True


class InventoryUpdate(BaseModel):
    """Request model for updating hotel inventory"""
    single: Optional[int] = None
    double: Optional[int] = None
    twin: Optional[int] = None
    standard_pool: Optional[int] = None
    comfort_pool: Optional[int] = None


class HotelOrderItem(BaseModel):
    """Single hotel order item for reordering"""
    id: str
    sort_order: int


class HotelReorderRequest(BaseModel):
    """Request model for reordering hotels"""
    hotels: List[HotelOrderItem]


class Booking(BaseModel):
    """Trip booking - supports single travelers, couples, and shared room options."""
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    booking_number: str = Field(default_factory=lambda: f"IW-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:6].upper()}")
    trip_id: str
    trip_name: str
    # Primary traveler (booking contact)
    salutation: str
    first_name: str
    last_name: str
    email: EmailStr
    street: str
    postal_code: str
    city: str
    country: str
    # Room selection
    room_type: str  # single, double, twin, shared (half double with partner assignment)
    # Traveling companions (for double/twin - 2 people total including primary)
    companion_salutation: Optional[str] = None
    companion_first_name: Optional[str] = None
    companion_last_name: Optional[str] = None
    # Trip dates (fixed)
    trip_start: str  # "2027-05-18"
    trip_end: str  # "2027-05-25"
    nights: int = 7
    # Pricing
    price_per_person: float
    participants: int  # 1 for single/shared, 2 for double/twin
    total_price: float
    deposit_amount: float  # 25%
    remaining_amount: float  # 75%
    # Payment
    payment_status: str = "pending"  # pending, deposit_paid, fully_paid, refunded, cancelled
    payment_method: Optional[str] = None  # paypal, bank_transfer
    paypal_order_id: Optional[str] = None
    invoice_number: Optional[str] = None
    notes: Optional[str] = None
    language: str = "de"  # Only German
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    # Legacy fields for compatibility (kept but unused for trips)
    hotel_id: Optional[str] = None
    hotel_name: Optional[str] = None
    check_in: Optional[str] = None
    check_out: Optional[str] = None
    price_per_night: Optional[float] = None


class BookingCreate(BaseModel):
    """Create a trip booking."""
    trip_id: str
    salutation: str
    first_name: str
    last_name: str
    email: EmailStr
    street: str
    postal_code: str
    city: str
    country: str
    room_type: str  # single, double, twin, shared
    # Companion info (required for double/twin)
    companion_salutation: Optional[str] = None
    companion_first_name: Optional[str] = None
    companion_last_name: Optional[str] = None
    notes: Optional[str] = None
    language: str = "de"


class PaymentTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    booking_id: str
    session_id: str
    payment_method: str
    amount: float
    currency: str = "EUR"
    status: str = "initiated"
    metadata: Dict = {}
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AdminUser(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    password_hash: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AdminLogin(BaseModel):
    email: EmailStr
    password: str


class AdminCreate(BaseModel):
    email: EmailStr
    password: str


class PayPalCaptureRequest(BaseModel):
    order_id: str


class ImageUploadResponse(BaseModel):
    id: str
    hotel_id: str
    url: str
    original_filename: str


class ImageRenameRequest(BaseModel):
    custom_name: str


class PayPalOrderRequest(BaseModel):
    """PayPal order request for trip booking."""
    trip_id: str
    salutation: str
    first_name: str
    last_name: str
    email: str
    street: str
    postal_code: str
    city: str
    country: str
    room_type: str  # single, double, twin, shared
    companion_salutation: str = ""
    companion_first_name: str = ""
    companion_last_name: str = ""
    notes: str = ""
    payment_method: str = "paypal"
    language: str = "de"
