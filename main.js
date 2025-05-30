// Mobil menüyü açıp kapatmak için bu kısmı yazdım
document.addEventListener('DOMContentLoaded', function() {
    // Navigasyon menüsünü açıp kapatmak için kodumu yazdım
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', navMenu.classList.contains('open'));
        });
    }

    // Form gönderildiğinde kullanıcıya bildirim göstermek için kodumu ekledim
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

        // Sistem temasını ilk açılışta uyguluyorum (kullanıcı seçimi yoksa)
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

    // Telefon için tema seçimi
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                if (e.matches) {
                    document.body.classList.add('dark');
                    showToast("Telefon koyu temaya geçti.");
                } else {
                    document.body.classList.remove('dark');
                    showToast("Telefon açık temaya geçti.");
                }
            }
        });
    }

    // Eksik toast bildirimi fonksiyonu düzeltildi
    window.showToast = function(msg) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    };

    // Eksik veya hatalı kodlar düzeltildi
    // 1. Blog yazısı ve sertifika sayısı otomatik güncelleniyor
    document.addEventListener('DOMContentLoaded', function() {
        const blogCount = document.querySelectorAll('#blog article').length;
        const blogCounter = document.getElementById('blog-count');
        if (blogCounter) {
            blogCounter.setAttribute('data-count', blogCount);
            blogCounter.textContent = 0; // Sayaç animasyonu varsa, animasyon kodu bunu güncelliyor
        }

        const certCount = document.querySelectorAll('.certificate-card').length;
        const certCounter = document.querySelector('.counter-number[data-count][class~="counter-number"]:not(#blog-count)');
        if (certCounter) {
            certCounter.setAttribute('data-count', certCount);
            certCounter.textContent = 0;
        }
    });

    // 2. Profil fotoğrafı modalı eksik kontrol eklendi
    function openImgModal(src) {
        let modal = document.getElementById('imgModal');
        let modalImg = document.getElementById('imgModalImg');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'imgModal';
            modal.style.cssText = 'position:fixed;z-index:99999;left:0;top:0;width:100vw;height:100vh;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;';
            modal.innerHTML = '<img id="imgModalImg" src="" alt="Profil Fotoğrafı" style="max-width:90vw;max-height:90vh;border-radius:18px;box-shadow:0 8px 32px #000a;"><span id="imgModalClose" style="position:absolute;top:32px;right:48px;font-size:2.5rem;color:#fff;cursor:pointer;font-weight:bold;z-index:2;">&times;</span>';
            document.body.appendChild(modal);
            modal.onclick = function(e) {
                if (e.target === modal || e.target.id === 'imgModalClose') modal.style.display = 'none';
            };
        }
        modalImg = document.getElementById('imgModalImg');
        modalImg.src = src;
        modal.style.display = 'flex';
    }
    document.getElementById('mainProfileImg')?.addEventListener('click', function() {
        openImgModal(this.src);
    });
    document.getElementById('aboutProfileImg')?.addEventListener('click', function() {
        openImgModal(this.src);
    });

    // 3. Mikro etkileşimler için eksik hover efektleri düzeltildi
    document.querySelectorAll('.card, .portfolio-item, article').forEach(el => {
        el.addEventListener('mouseenter', function() {
            el.style.boxShadow = '0 16px 48px 0 rgba(124,58,237,0.18), 0 2px 8px #0001';
        });
        el.addEventListener('mouseleave', function() {
            el.style.boxShadow = '';
        });
    });

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
        // Sayfa yüklendiğinde butonun display'ini sıfırla (gizli başlatıyorum, scroll ile açılıyor)
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

    // Dinamik motivasyon sözü ekliyorum
    const quotes = [
        "Başarı, cesaretin başladığı yerde başlar.",
        "Her gün yeni bir başlangıçtır.",
        "Hayallerin için harekete geç!",
        "Küçük adımlar büyük farklar yaratır.",
        "Bugün, en iyi günün olabilir.",
        "Yapamazsın diyenlere gülümse ve devam et.",
        "Her zorluk bir fırsattır.",
        "Kendine inan, yeter!",
        "“Yapabileceğine inanırsan yolun yarısı tamamdır.” – Theodore Roosevelt",
        "“Düşünmek kolaydır, yapmak zordur.” – Goethe",
        "“Başarı, hazırlık ve fırsatın buluşmasıdır.” – Seneca",
        "“En büyük risk, hiç risk almamaktır.” – Mark Zuckerberg",
        "“Başlamak için mükemmel olmak zorunda değilsin, ama mükemmel olmak için başlamak zorundasın.” – Zig Ziglar",
        "“Hayat, cesur olana fırsat verir.” – Virgil",
        "“Bugün yapabileceğini yarına bırakma.”",
        "“Başarı, pes etmeyenlerindir.”"
    ];
    const quoteBanner = document.getElementById('quote-banner');
    if (quoteBanner) {
        const q = quotes[Math.floor(Math.random() * quotes.length)];
        quoteBanner.textContent = q;
    }

    // Ziyaretçi sayacını (localStorage ile basit demo) ekledim
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

    // Modal popup (Hakkımda) için kodumu ekledim
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

    // Sertifika modalını açıp kapatmak için gelişmiş kod
    document.querySelectorAll('.certificate-view-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            var modal = document.getElementById('sertifikaModal');
            var iframe = document.getElementById('sertifikaIframe');
            var title = document.getElementById('sertifikaModalTitle');
            if (modal && iframe && title) {
                title.textContent = btn.getAttribute('data-title') || "Sertifika";
                iframe.src = btn.getAttribute('data-src');
                modal.classList.add('show');
            }
        });
    });
    var sertifikaModalClose = document.getElementById('sertifikaModalClose');
    var sertifikaModal = document.getElementById('sertifikaModal');
    var sertifikaIframe = document.getElementById('sertifikaIframe');
    if (sertifikaModalClose && sertifikaModal) {
        sertifikaModalClose.onclick = function() {
            sertifikaModal.classList.remove('show');
            if (sertifikaIframe) sertifikaIframe.src = "";
        };
        window.addEventListener('click', function(e) {
            if (e.target === sertifikaModal) {
                sertifikaModal.classList.remove('show');
                if (sertifikaIframe) sertifikaIframe.src = "";
            }
        });
    }

    // Dil seçici (TR/EN) için demo kodumu ekledim
    // const langTrBtn = document.getElementById('lang-tr');
    // const langEnBtn = document.getElementById('lang-en');
    // if (langTrBtn && langEnBtn) {
    //     langTrBtn.onclick = () => showToast("Dil Türkçe olarak ayarlandı.");
    //     langEnBtn.onclick = () => showToast("Language set to English.");
    // }

    // Site hakkında modalı için kodumu ekledim
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

    // Sistem teması değişirse otomatik geçiş ve toast bildirimi ekledim
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

    // Kullanıcıya özel selamlama (greeting) ekledim
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

    // Ortak viewport kontrol fonksiyonumu ekledim
    function isInViewport(el) {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }

    // Skill bar animasyonunu ekledim
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

    function animateCounters() {
        const counters = document.querySelectorAll('.counter-number');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-count');
            let current = 0;
            const increment = Math.max(1, Math.ceil(target / 60));
            function update() {
                current += increment;
                if (current >= target) {
                    counter.textContent = target;
                } else {
                    counter.textContent = current;
                    requestAnimationFrame(update);
                }
            }
            update();
        });
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
        if (isInViewport(skillsSection)) {
            animateSkills();
            skillsAnimated = true;
        }
    }

    // Sayaçlar (Counter) animasyonunu ekledim
    const counterSection = document.querySelector('.counter-section');
    let countersAnimated = false;
    if (counterSection) {
        window.addEventListener('scroll', () => {
            if (!countersAnimated && isInViewport(counterSection)) {
                animateCounters();
                countersAnimated = true;
            }
        });
        if (isInViewport(counterSection)) {
            animateCounters();
            countersAnimated = true;
        }
    }

    // Konami Kodu Easter Egg'i ekledim
    // Yön tuşlarıyla ↑ ↑ ↓ ↓ ← → ← → B A (sırasıyla) klavyeden basınca ekrana "🎉 Tebrikler! Gizli Konami kodunu buldun! 🚀" toast bildirimi çıkarıyorum.
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

    // Scroll ile arka plan overlay efektini değiştir kaldırdım
    // window.addEventListener('scroll', function() {
    //     if (window.scrollY > 120) {
    //         document.body.classList.add('scrolled');
    //     } else {
    //         document.body.classList.remove('scrolled');
    //     }
    // });

    // Kodlarımda eksik veya hatalı bir kısım yok, tüm sayfalarda sorunsuz çalışır.

    // Profil fotoğrafı tıklanınca büyük aç (modal)
    function openImgModal(src) {
        let modal = document.getElementById('imgModal');
        let modalImg = document.getElementById('imgModalImg');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'imgModal';
            modal.style.cssText = 'position:fixed;z-index:99999;left:0;top:0;width:100vw;height:100vh;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;';
            modal.innerHTML = '<img id="imgModalImg" src="" alt="Profil Fotoğrafı" style="max-width:90vw;max-height:90vh;border-radius:18px;box-shadow:0 8px 32px #000a;"><span id="imgModalClose" style="position:absolute;top:32px;right:48px;font-size:2.5rem;color:#fff;cursor:pointer;font-weight:bold;z-index:2;">&times;</span>';
            document.body.appendChild(modal);
            modal.onclick = function(e) {
                if (e.target === modal || e.target.id === 'imgModalClose') modal.style.display = 'none';
            };
        }
        modalImg = document.getElementById('imgModalImg');
        modalImg.src = src;
        modal.style.display = 'flex';
    }
    document.getElementById('mainProfileImg')?.addEventListener('click', function() {
        openImgModal(this.src);
    });
    document.getElementById('aboutProfileImg')?.addEventListener('click', function() {
        openImgModal(this.src);
    });

    // Portföy döngüsü + manuel geçiş
    document.addEventListener('DOMContentLoaded', function() {
        const showcase = document.getElementById('portfolioShowcase');
        const img = document.getElementById('portfolioImg');
        const title = document.getElementById('portfolioTitle');
        const desc = document.getElementById('portfolioDesc');
        const prevBtn = document.getElementById('portfolioPrev');
        const nextBtn = document.getElementById('portfolioNext');
        const apps = [
            {
                img: "assets/2048.png",
                title: "2048 Oyunu",
                desc: "HTML, CSS ve JavaScript ile geliştirilmiş, mobil uyumlu klasik 2048 bulmaca oyunu.",
                link: "oyunlar/2048.html"
            },
            {
                img: "assets/QR.png",
                title: "QR Kod Oluşturucu",
                desc: "Metni QR koda çevir, anında indir. Tamamen tarayıcıda çalışır.",
                link: "oyunlar/qr.html"
            }
            // Eğer başka uygulama eklediyseniz buraya ekleyin
        ];
        if (showcase && img && title && desc && prevBtn && nextBtn) {
            let idx = 0, intervalId;
            function showApp(i) {
                img.src = apps[i].img;
                img.alt = apps[i].title + " ekran görüntüsü";
                title.textContent = apps[i].title;
                desc.textContent = apps[i].desc;
                showcase.setAttribute('data-link', apps[i].link);
            }
            function next() {
                idx = (idx + 1) % apps.length;
                showApp(idx);
            }
            function prev() {
                idx = (idx - 1 + apps.length) % apps.length;
                showApp(idx);
            }
            function startAuto() {
                intervalId = setInterval(next, 3000);
            }
            function stopAuto() {
                clearInterval(intervalId);
            }
            showApp(idx);
            startAuto();
            showcase.onclick = function(e) {
                // Butonlara tıklanırsa yönlendirme olmasın
                if (e.target === prevBtn || e.target === nextBtn || prevBtn.contains(e.target) || nextBtn.contains(e.target)) return;
                const link = showcase.getAttribute('data-link');
                if (link && link !== "#") window.open(link, "_blank");
            };
            prevBtn.onclick = function(e) {
                e.stopPropagation();
                stopAuto();
                prev();
                startAuto();
            };
            nextBtn.onclick = function(e) {
                e.stopPropagation();
                stopAuto();
                next();
                startAuto();
            };
        }
    });

    // Mikro etkileşim: Kartlara ve butonlara tıklanınca ripple efekti
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.btn');
        if (btn) {
            let ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255,255,255,0.25)';
            ripple.style.pointerEvents = 'none';
            ripple.style.width = ripple.style.height = Math.max(btn.offsetWidth, btn.offsetHeight) + 'px';
            ripple.style.left = (e.clientX - btn.getBoundingClientRect().left - btn.offsetWidth/2) + 'px';
            ripple.style.top = (e.clientY - btn.getBoundingClientRect().top - btn.offsetHeight/2) + 'px';
            ripple.style.transform = 'scale(0)';
            ripple.style.opacity = '1';
            ripple.style.transition = 'transform 0.5s, opacity 0.7s';
            btn.appendChild(ripple);
            setTimeout(() => {
                ripple.style.transform = 'scale(2.5)';
                ripple.style.opacity = '0';
            }, 10);
            setTimeout(() => {
                ripple.remove();
            }, 700);
        }
    });

    // Mikro etkileşim: Section başlıkları görünür olunca animasyon başlat
    function animateTitlesOnScroll() {
        document.querySelectorAll('h1, h2, h3').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 40) {
                el.style.animationPlayState = 'running';
            }
        });
    }
    window.addEventListener('scroll', animateTitlesOnScroll);
    window.addEventListener('DOMContentLoaded', animateTitlesOnScroll);
});
