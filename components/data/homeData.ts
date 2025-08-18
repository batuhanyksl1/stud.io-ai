// Carousel için örnek veriler
export const carouselData = [
  {
    id: 1,
    title: 'Portre Düzenleme',
    subtitle: 'Yüz güzelleştirme ve renk düzeltme',
    icon: 'accessibility',
    gradient: ['#FF6B6B', '#FFE66D'],
    image1: require('@/assets/images/carousel/image-a-1.png'),
    image2: require('@/assets/images/carousel/image-a-2.jpg'),
  },
  {
    id: 2,
    title: 'Manzara Fotoğrafları',
    subtitle: 'Doğal renkleri canlandırın',
    icon: 'accessibility',
    gradient: ['#4ECDC4', '#44A08D'],
    image1: require('@/assets/images/carousel/image-a-1.png'),
    image2: require('@/assets/images/carousel/image-a-2.jpg'),
  },
  {
    id: 3,
    title: 'Ürün Fotoğrafları',
    subtitle: 'Profesyonel görünüm',
    icon: 'accessibility',
    gradient: ['#A8E6CF', '#7FCDCD'],
    image1: require('@/assets/images/carousel/image-a-1.png'),
    image2: require('@/assets/images/carousel/image-a-2.jpg'),
  },
  {
    id: 4,
    title: 'Sokak Fotoğrafçılığı',
    subtitle: 'Dramatik efektler ekleyin',
    icon: 'accessibility',
    gradient: ['#FF9A9E', '#FECFEF'],
    image1: require('@/assets/images/carousel/image-a-1.png'),
    image2: require('@/assets/images/carousel/image-a-2.jpg'),
  },
];

// Ana servislerimiz
export const editingServices = [
  {
    id: 'profile-picture',
    title: 'Profil Fotoğrafı',
    subtitle: 'LinkedIn Ready',
    description: 'LinkedIn için profesyonel profil fotoğrafları oluşturun',
    icon: 'person',
    color: '#0077B5',
    gradient: ['#0077B5', '#005885'],
    features: ['Profesyonel filtreler', 'Otomatik boyutlandırma', 'LinkedIn uyumlu format'],
    rating: 4.8,
    usageCount: '2.5K+',
    isPopular: true,
    badge: 'En Popüler',
  },
  {
    id: 'background-removal',
    title: 'Arka Plan Kaldırma',
    subtitle: 'AI Powered',
    description: 'Fotoğraflarınızdan arka planı otomatik olarak kaldırın',
    icon: 'image',
    color: '#10B981',
    gradient: ['#10B981', '#059669'],
    features: ['AI destekli arka plan kaldırma', 'Hassas kenar tespiti', 'Şeffaf PNG çıktı'],
    rating: 4.7,
    usageCount: '1.8K+',
    isPopular: false,
    badge: 'Hızlı',
  },
  {
    id: 'photo-enhancement',
    title: 'Fotoğraf İyileştirme',
    subtitle: 'Smart Enhancement',
    description: 'Fotoğraflarınızı AI ile otomatik olarak iyileştirin',
    icon: 'color-wand',
    color: '#F59E0B',
    gradient: ['#F59E0B', '#D97706'],
    features: ['Otomatik parlaklık ayarı', 'Gürültü azaltma', 'Keskinlik artırma'],
    rating: 4.6,
    usageCount: '1.2K+',
    isPopular: false,
    badge: 'Kaliteli',
  },
  {
    id: 'style-transfer',
    title: 'Stil Transferi',
    subtitle: 'Artistic AI',
    description: 'Fotoğraflarınıza sanatsal stiller uygulayın',
    icon: 'cut',
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#7C3AED'],
    features: ['Çoklu sanat stili', 'Gerçek zamanlı önizleme', 'Stil yoğunluğu ayarı'],
    rating: 4.9,
    usageCount: '3.1K+',
    isPopular: true,
    badge: 'Yaratıcı',
  },
];

// Hızlı aksiyonlar
export const quickActions = [
  {
    id: 'camera',
    title: 'Fotoğraf Çek',
    icon: 'camera',
    color: '#3B82F6',
    gradient: ['#3B82F6', '#1D4ED8'],
  },
  {
    id: 'gallery',
    title: 'Galeriden Seç',
    icon: 'image',
    color: '#10B981',
    gradient: ['#10B981', '#059669'],
  },
  {
    id: 'recent',
    title: 'Son Düzenlemeler',
    icon: 'pencil',
    color: '#F59E0B',
    gradient: ['#F59E0B', '#D97706'],
  },
  {
    id: 'premium',
    title: 'Premium Özellikler',
    icon: 'color-wand',
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#7C3AED'],
  },
];

// Son aktiviteler (mock data)
export const recentActivity = [
  {
    id: '1',
    title: 'LinkedIn Profil Fotoğrafı',
    service: 'Profil Fotoğrafı',
    timestamp: '2 saat önce',
    status: 'completed',
    thumbnail: '📸',
  },
  {
    id: '2',
    title: 'Arka Plan Kaldırma',
    service: 'Arka Plan Kaldırma',
    timestamp: '1 gün önce',
    status: 'completed',
    thumbnail: '🖼️',
  },
  {
    id: '3',
    title: 'Sanatsal Stil',
    service: 'Stil Transferi',
    timestamp: '3 gün önce',
    status: 'completed',
    thumbnail: '🎨',
  },
];

// İstatistikler
export const todayStats = [
  {
    title: 'Bugün İşlenen',
    value: '24',
    change: '+12%',
    icon: 'trending-up',
    color: '#10B981',
  },
  {
    title: 'Bu Hafta',
    value: '156',
    change: '+8%',
    icon: 'accessibility',
    color: '#3B82F6',
  },
  {
    title: 'Toplam Proje',
    value: '1.2K',
    change: '+24%',
    icon: 'accessibility',
    color: '#8B5CF6',
  },
];
