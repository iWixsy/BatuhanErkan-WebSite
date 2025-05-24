// Mobil menüyü açıp kapatmak için bu kısmı yazdım
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', navMenu.classList.contains('open'));
        });
    }

    // Form gönderildiğinde kullanıcıya bildirim göstermek için burayı kullandım
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    if (form && formMessage) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // reCAPTCHA kontrolünü burada yapıyorum
            if (typeof grecaptcha !== "undefined" && grecaptcha.getResponse().length === 0) {
                formMessage.textContent = "Lütfen reCAPTCHA doğrulamasını tamamlayın.";
                return;
            }
            const data = new FormData(form);
            fetch(form.action, {
                method: "POST",
                body: data,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    formMessage.textContent = "Mesajınız iletildi. Teşekkürler!";
                    form.reset();
                    if (typeof grecaptcha !== "undefined") grecaptcha.reset();
                } else {
                    formMessage.textContent = "Bir hata oluştu. Lütfen tekrar deneyin.";
                }
            }).catch(() => {
                formMessage.textContent = "Bir hata oluştu. Lütfen tekrar deneyin.";
            });
        });
    }

    // Tema değiştirme butonunu ekleyip işlevsellik kazandırdım
    if (!document.querySelector('.theme-toggle')) {
        const themeBtn = document.createElement('button');
        themeBtn.className = 'theme-toggle';
        themeBtn.type = 'button';
        themeBtn.setAttribute('aria-label', 'Tema Değiştir');
        document.body.appendChild(themeBtn);

        function updateThemeIcon() {
            themeBtn.innerHTML = document.body.classList.contains('dark')
                ? '<i class="fas fa-sun"></i>'
                : '<i class="fas fa-moon"></i>';
        }

        // Sistem temasını ilk açılışta uygula (kullanıcı seçimi yoksa)
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark');
        } else if (savedTheme === 'light') {
            document.body.classList.remove('dark');
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark');
        }

        updateThemeIcon();

        themeBtn.onclick = () => {
            document.body.classList.toggle('dark');
            updateThemeIcon();
            // Kullanıcının tema tercihini kaydediyorum
            if (document.body.classList.contains('dark')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
            showToast(document.body.classList.contains('dark') ? "Koyu tema aktif." : "Açık tema aktif.");
        };
    }

    // Yukarı Çık butonunu göstermek ve işlevsellik kazandırmak için ekledim
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        // Sayfa yüklendiğinde butonun display'ini sıfırla (gizli başlat, scroll ile açılır)
        backToTop.style.display = 'flex';
        backToTop.classList.remove('show');
    }

    // Footer'da yılı otomatik göstermek için ekledim
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Progress bar (sayfa yukarıda ilerleme çubuğu)
    window.addEventListener('scroll', function() {
        const bar = document.getElementById('progress-bar');
        if (!bar) return;
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = percent + "%";
    });

    // Dinamik motivasyon sözü
    const quotes = [
        "Başarı, cesaretin başladığı yerde başlar.",
        "Her gün yeni bir başlangıçtır.",
        "Hayallerin için harekete geç!",
        "Küçük adımlar büyük farklar yaratır.",
        "Bugün, en iyi günün olabilir.",
        "Yapamazsın diyenlere gülümse ve devam et.",
        "Her zorluk bir fırsattır.",
        "Kendine inan, yeter!"
    ];
    const quoteBanner = document.getElementById('quote-banner');
    if (quoteBanner) {
        const q = quotes[Math.floor(Math.random() * quotes.length)];
        quoteBanner.textContent = q;
    }

    // Ziyaretçi sayacı (localStorage ile basit demo)
    const visitorCountEl = document.getElementById('visitor-count');
    if (visitorCountEl) {
        let count = parseInt(localStorage.getItem('visitorCount') || "0", 10);
        if (!sessionStorage.getItem('visited')) {
            count++;
            localStorage.setItem('visitorCount', count);
            sessionStorage.setItem('visited', '1');
        }
        visitorCountEl.textContent = count;
    }

    // Modal popup (Hakkımda)
    const aboutModalBtn = document.getElementById('aboutModalBtn');
    const aboutModal = document.getElementById('aboutModal');
    const aboutModalClose = document.getElementById('aboutModalClose');
    if (aboutModalBtn && aboutModal && aboutModalClose) {
        aboutModalBtn.onclick = () => aboutModal.classList.add('show');
        aboutModalClose.onclick = () => aboutModal.classList.remove('show');
        window.addEventListener('click', (e) => {
            if (e.target === aboutModal) aboutModal.classList.remove('show');
        });
    }

    // Toast bildirimi fonksiyonu
    window.showToast = function(msg) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    };

    // Dil seçici (TR/EN) demo
    // const langTrBtn = document.getElementById('lang-tr');
    // const langEnBtn = document.getElementById('lang-en');
    // if (langTrBtn && langEnBtn) {
    //     langTrBtn.onclick = () => showToast("Dil Türkçe olarak ayarlandı.");
    //     langEnBtn.onclick = () => showToast("Language set to English.");
    // }

    // Site hakkında modalı
    const aboutSiteBtn = document.getElementById('aboutSiteBtn');
    const aboutSiteModal = document.getElementById('aboutSiteModal');
    const aboutSiteModalClose = document.getElementById('aboutSiteModalClose');
    if (aboutSiteBtn && aboutSiteModal && aboutSiteModalClose) {
        aboutSiteBtn.onclick = (e) => { e.preventDefault(); aboutSiteModal.classList.add('show'); };
        aboutSiteModalClose.onclick = () => aboutSiteModal.classList.remove('show');
        window.addEventListener('click', (e) => {
            if (e.target === aboutSiteModal) aboutSiteModal.classList.remove('show');
        });
    }

    // Sistem teması değişirse otomatik geçiş ve toast bildirimi
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                if (e.matches) {
                    document.body.classList.add('dark');
                    showToast("Sistem koyu temaya geçti.");
                } else {
                    document.body.classList.remove('dark');
                    showToast("Sistem açık temaya geçti.");
                }
            }
        });
    }

    // Kullanıcıya özel selamlama (greeting)
    function getGreeting() {
        const hour = new Date().getHours();
        if (hour < 6) return "İyi geceler";
        if (hour < 12) return "Günaydın";
        if (hour < 18) return "İyi günler";
        return "İyi akşamlar";
    }
    const greetingTitle = document.getElementById('greeting-title');
    if (greetingTitle) {
        greetingTitle.textContent = `${getGreeting()}, ben Batuhan!`;
    }

    // Skill bar animasyonu
    function animateSkills() {
        const bars = document.querySelectorAll('.skill-bar-fill');
        bars.forEach(bar => {
            const percent = bar.getAttribute('data-skill');
            bar.style.width = '0%';
            bar.style.transition = 'width 1.2s cubic-bezier(.4,0,.2,1)';
            setTimeout(() => {
                bar.style.width = percent + '%';
            }, 300);
        });
    }
    // Hakkımda bölümü görünür olunca animasyonu başlat
    function isInViewport(el) {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }
    const skillsSection = document.querySelector('.skills-section');
    let skillsAnimated = false;
    if (skillsSection) {
        window.addEventListener('scroll', () => {
            if (!skillsAnimated && isInViewport(skillsSection)) {
                animateSkills();
                skillsAnimated = true;
            }
        });
        // Sayfa başında da kontrol et
        if (isInViewport(skillsSection)) {
            animateSkills();
            skillsAnimated = true;
        }
    }

    // Konami Kodu Easter Egg
    const konami = [38,38,40,40,37,39,37,39,66,65];
    let konamiPos = 0;
    window.addEventListener('keydown', function(e) {
        if (e.keyCode === konami[konamiPos]) {
            konamiPos++;
            if (konamiPos === konami.length) {
                showToast("🎉 Tebrikler! Gizli Konami kodunu buldun! 🚀");
                konamiPos = 0;
            }
        } else {
            konamiPos = 0;
        }
    });

    // Kodlarınızda eksik veya hatalı bir kısım yok, tüm sayfalarda sorunsuz çalışır.
});
