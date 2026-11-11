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
  let promptEvent = null, installing = false, installed = false, keyboardNavigation = false;
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
  mobile.addEventListener('change', show);
  document.addEventListener('pointerdown', () => { keyboardNavigation = false; });
  document.addEventListener('keydown', event => { if (event.key === 'Tab') { keyboardNavigation = true; show(); } });
  function updateInstall() { button.hidden = installed || standalone.matches || navigator.standalone === true; }
  addEventListener('beforeinstallprompt', event => {
    event.preventDefault(); promptEvent = event; updateInstall();
  });
  addEventListener('appinstalled', () => {
    installed = true; promptEvent = null; updateInstall();
    toast('Đã cài ứng dụng. Chúc bạn học tốt!');
  });
  standalone.addEventListener('change', updateInstall);
  button.addEventListener('click', async () => {
    if (installing) return;
    if (!promptEvent) {
      const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      showModal(`${modalHeading('Cài ứng dụng GPLX')}<div class="modal-copy"><p>${ios ? 'Trên iPhone/iPad, mở trang bằng Safari, nhấn Chia sẻ, chọn Thêm vào Màn hình chính rồi nhấn Thêm.' : 'Mở menu trình duyệt Chrome/Edge và chọn Cài ứng dụng hoặc Thêm vào màn hình chính nếu có. Nếu chưa thấy, hãy mở trang trực tiếp bằng trình duyệt, chờ tải xong rồi thử lại.'}</p><p>Sau khi cài, mở GPLX từ biểu tượng trên màn hình của bạn. Để học không có mạng, hãy chọn “Tải để học ngoại tuyến” ở Tổng quan và chờ hoàn tất.</p></div>`);
      return;
    }
    installing = true; button.disabled = true;
    const pending = promptEvent; promptEvent = null;
    try {
      await pending.prompt();
      const choice = await pending.userChoice;
      if (choice.outcome === 'accepted') toast('Đã gửi yêu cầu cài ứng dụng.');
    } catch { toast('Chưa mở được cửa sổ cài đặt. Bạn có thể thử từ menu trình duyệt.'); }
    finally { installing = false; button.disabled = false; updateInstall(); }
  });
  show(); updateInstall();
  return { show };
}
