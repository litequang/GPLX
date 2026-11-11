// One shared visibility state keeps the header and navigation in lockstep.
export function initChrome({ showModal, modalHeading, toast }) {
  const body = document.body;
  const header = document.querySelector('.topbar');
  const nav = document.querySelector('#bottom-nav');
  const sidebar = document.querySelector('#sidebar');
  const button = document.querySelector('#install-button');
  const standalone = matchMedia('(display-mode: standalone)');
  const mobile = matchMedia('(max-width: 700px)');
  let previous = window.scrollY, distance = 0, direction = 0, frame = 0;
  const installState = window.gplxInstall || (window.gplxInstall = { prompt: null, installed: false });
  const android = /Android/i.test(navigator.userAgent);
  const nativeInstallBrowser = android && /Chrome|Chromium|EdgA|SamsungBrowser/i.test(navigator.userAgent) && !/; wv\)|FBAN|FBAV|Instagram/i.test(navigator.userAgent);
  let installing = false, accepted = false, keyboardNavigation = false;
  const position = () => Math.max(0, Math.min(window.scrollY, Math.max(0, document.documentElement.scrollHeight - innerHeight)));
  function setHidden(hidden) {
    body.classList.toggle('chrome-hidden', hidden);
    // Hidden controls must not remain keyboard/screen-reader destinations.
    header.inert = nav.inert = hidden;
    sidebar.inert = hidden || mobile.matches;
  }
  function show() { previous = position(); distance = 0; direction = 0; setHidden(false); }
  function update() {
    frame = 0;
    const current = position(), delta = current - previous;
    previous = current;
    const focused = document.activeElement;
    if (current < 32 || document.querySelector('dialog[open]') ||
        (keyboardNavigation && [header, nav, sidebar].some(el => el.contains(focused)))) { show(); return; }
    if (!delta) return;
    const nextDirection = Math.sign(delta);
    distance = nextDirection === direction ? distance + Math.abs(delta) : Math.abs(delta);
    direction = nextDirection;
    if (distance >= (direction > 0 ? 36 : 14)) {
      setHidden(direction > 0 && current > 100);
      distance = 0;
    }
  }
  addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
  addEventListener('resize', show);
  const onMediaChange = (media, callback) => {
    if (media.addEventListener) media.addEventListener('change', callback);
    else media.addListener?.(callback);
  };
  onMediaChange(mobile, show);
  document.addEventListener('pointerdown', () => { keyboardNavigation = false; });
  document.addEventListener('keydown', event => { if (event.key === 'Tab') { keyboardNavigation = true; show(); } });
  function updateInstall() {
    button.hidden = installState.installed || accepted || standalone.matches || navigator.standalone === true;
    button.disabled = installing;
    button.textContent = installing ? 'Đang cài…' : installState.prompt ? 'Cài ngay' : nativeInstallBrowser ? 'Cài ứng dụng' : 'Cách cài ứng dụng';
    button.title = installState.prompt ? 'Chạm để mở xác nhận cài GPLX' : 'Cài GPLX lên màn hình chính';
  }
  addEventListener('beforeinstallprompt', event => {
    event.preventDefault(); installState.prompt = event; accepted = false; updateInstall();
  });
  addEventListener('appinstalled', () => {
    installState.installed = true; installState.prompt = null; updateInstall();
    toast('Đã cài ứng dụng. Chúc bạn học tốt!');
  });
  onMediaChange(standalone, updateInstall);
  button.addEventListener('click', async () => {
    if (installing || installState.installed || accepted) return;
    if (!installState.prompt) {
      if (nativeInstallBrowser) {
        toast('Chưa có xác nhận cài từ trình duyệt. Bạn có thể tiếp tục học; khi sẵn sàng, nút sẽ đổi thành “Cài ngay”.');
        return;
      }
      const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      showModal(`${modalHeading('Cài ứng dụng GPLX')}<div class="modal-copy"><p>${ios ? 'Trên iPhone/iPad, mở trang bằng Safari, nhấn Chia sẻ, chọn Thêm vào Màn hình chính rồi nhấn Thêm.' : 'Mở menu trình duyệt Chrome/Edge và chọn Cài ứng dụng hoặc Thêm vào màn hình chính nếu có. Nếu chưa thấy, hãy mở trang trực tiếp bằng trình duyệt, chờ tải xong rồi thử lại.'}</p><p>Sau khi cài, mở GPLX từ biểu tượng trên màn hình của bạn. Để học không có mạng, hãy chọn “Tải để học ngoại tuyến” ở Tổng quan và chờ hoàn tất.</p></div>`);
      return;
    }
    installing = true;
    const pending = installState.prompt; installState.prompt = null;
    updateInstall();
    try {
      await pending.prompt();
      const choice = await pending.userChoice;
      if (choice.outcome === 'accepted') { accepted = true; toast('Đang cài GPLX. Biểu tượng sẽ xuất hiện khi trình duyệt hoàn tất.'); }
    } catch { toast('Chưa mở được cửa sổ cài đặt. Bạn có thể thử từ menu trình duyệt.'); }
    finally { installing = false; button.disabled = false; updateInstall(); }
  });
  show(); updateInstall();
  return { show };
}
