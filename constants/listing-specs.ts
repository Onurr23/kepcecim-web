
export const SPEC_LABEL_MAP: Record<string, string> = {
    // Common Machine Specs
    engine_power: 'Motor Gücü',
    operating_weight: 'Çalışma Ağırlığı',
    bucket_capacity: 'Kova Kapasitesi',
    digging_depth: 'Kazı Derinliği',
    max_reach_ground: 'Max Yerden Erişim',
    track_shoe_width: 'Palet Genişliği',
    undercarriage_type: 'Alt Takım Tipi',
    breaker_line: 'Kırıcı Hattı',
    max_lift_height: 'Maksimum Kaldırma Yüksekliği',
    max_lift_capacity: 'Maksimum Kaldırma Kapasitesi',
    max_forward_reach: 'Maksimum İleri Erişim',
    lift_capacity_at_max_reach: 'Maksimum Erişimde Kaldırma Kapasitesi',
    drivetrain: 'Tahrik Tipi',
    front_bucket_capacity: 'Ön Kepçe Kapasitesi',
    loader_lift_capacity: 'Yükleyici Kaldırma Kapasitesi',
    extendable_arm: 'Çıkabilir Kol',
    tipping_load: 'Devirme Yükü',
    breakout_force: 'Kırma Gücü',
    dump_clearance: 'Dökme Açıklığı',
    sub_type: 'Alt Tip',
    class: 'Sınıf',

    // Crane & Lifting
    mast_type: 'Mast Tipi',
    tire_type: 'Lastik Tipi',
    wheel_count: 'Tekerlek Sayısı',
    side_shifter: 'Sağa Sola Kaydırma',
    lifting_height: 'Kaldırma Yüksekliği',
    lifting_capacity: 'Kaldırma Kapasitesi',
    crane_type: 'Vinç Tipi',
    chassis_type: 'Şasi Tipi',
    max_vertical_reach: 'Maksimum Dikey Erişim',
    max_horizontal_reach: 'Maksimum Yatay Erişim',
    max_lifting_capacity: 'Maksimum Kaldırma Kapasitesi',

    // Truck/Vehicle Info (for Mobile Crane/Lifts)
    truck_info: 'Kamyon Bilgisi',
    axle: 'Aks Yapısı',
    brand_name: 'Kamyon Markası',
    model: 'Kamyon Modeli',
    year: 'Kamyon Yılı',

    // Condition & Other
    tire_condition: 'Lastik Durumu',
    usage_type: 'Kullanım Tipi',
    shipping: 'Gönderim',
    warranty: 'Garanti',
    shipping_info: 'Kargo Bilgisi',
    shipping_fee: 'Kargo Ücreti',
    condition: 'Kondisyon',
    operator_included: 'Operatör Durumu',
    fuel_included: 'Yakıt Durumu',
};

export const PARTS_TERMS: Record<string, string> = {
    // General Terms
    partNumber: 'Parça Numarası',
    compatibility: 'Uyumluluk',
    specifications: 'Teknik Özellikler',
    dimensions: 'Boyutlar',
    weight: 'Ağırlık',
    material: 'Malzeme',
    manufacturer: 'Üretici',
    originCountry: 'Menşe Ülke',
    certification: 'Sertifika',

    // Commercial Terms
    wholesalePrice: 'Toptan Fiyat',
    retailPrice: 'Perakende Fiyat',
    minimumOrder: 'Minimum Sipariş',
    leadTime: 'Teslim Süresi',
    availability: 'Mevcut Durum',

    // Condition Codes
    new: 'Sıfır',
    likeNew: 'Sıfır Ayarında',
    good: 'İyi',
    fair: 'Orta',
    poor: 'Kötü',
    refurbished: 'Revizyonlu',
    used: 'İkinci El',
    original: 'Orijinal',
    aftermarket: 'Yan Sanayi'
};

export const TIRE_CONDITION_OPTIONS: Record<number, string> = {
    100: '%100 (Yeni / Sıfır)',
    75: '%75 (İyi)',
    50: '%50 (Orta/Yarı Ömür)',
    25: '%25 (Düşük/Değişim Yakın)',
    0: '%0 (Bitik/Değişim Şart)'
};

export const SHIPPING_INFO: Record<string, string> = {
    buyer_pays: 'Alıcı Öder',
    seller_pays: 'Satıcı Öder',
    fixed_price: 'Sabit Fiyat',
    free_shipping: 'Ücretsiz Kargo',
    pickup_only: 'Sadece Elden Teslim'
};
