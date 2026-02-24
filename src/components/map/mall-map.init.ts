/**
 * Chuyển đổi logic từ Interactive3DMallMap main.js sang React-safe module
 * Khôi phục 1:1 hành vi bản gốc (bao gồm List.js)
 * Chuẩn hóa sử dụng Room Name từ DB (101, 201...) thay vì 1.01
 */

declare var List: any;

export function initMallMap(onSelectRoom?: (key: string | null) => void) {
  // Scope selector trong mallmap-integration để tránh conflict
  const wrapper = document.querySelector('.mallmap-integration');
  if (!wrapper) return null;

  const containerEl = wrapper.querySelector('.container');
  const mall = containerEl?.querySelector('.mall');
  const mallLevelsEl = mall?.querySelector('.levels');
  const mallNav = containerEl?.querySelector('.mallnav');
  const spacesListEl = wrapper.querySelector('#spaces-list');
  const contentEl = containerEl?.querySelector('.content');

  if (!containerEl || !mall || !mallLevelsEl || !mallNav || !spacesListEl || !contentEl) {
    console.warn('Không tìm thấy các phần tử cần thiết cho bản đồ (Logic DB Key)');
    return null;
  }

  // --- Trạng thái nội bộ ---
  let selectedLevel: number | null = null;
  let isOpenContentArea = false;
  let isNavigating = false;
  let isExpanded = false;
  let spaceref: string | null = null;

  const mallLevels = Array.from(mallLevelsEl.querySelectorAll('.level'));
  const mallLevelsTotal = mallLevels.length;
  const mallSurroundings = Array.from(mall.querySelectorAll('.surroundings'));
  const pins = Array.from(mallLevelsEl.querySelectorAll('.pin'));
  const spaces = Array.from(spacesListEl.querySelectorAll('.list__item > a.list__link'));
  const contentCloseCtrl = contentEl.querySelector('button.content__button');
  const allLevelsCtrl = mallNav.querySelector('.mallnav__button--all-levels');
  const levelUpCtrl = mallNav.querySelector('.mallnav__button--up');
  const levelDownCtrl = mallNav.querySelector('.mallnav__button--down');
  const sortByNameCtrl = spacesListEl.querySelector('#sort-by-name') as HTMLInputElement;
  const openSearchCtrl = wrapper.querySelector('button.open-search');
  const closeSearchCtrl = spacesListEl.querySelector('button.close-search');
  const spacesEl = spacesListEl.querySelector('ul.list');

  // Khởi tạo List.js (giả định list.min.js đã được load vào window)
  let spacesList: any = null;
  if (typeof List !== 'undefined') {
    try {
      spacesList = new List('spaces-list', {
        valueNames: ['list__link', { data: ['level'] }, { data: ['category'] }]
      });
    } catch (e) {
      console.warn('Lỗi khởi tạo List.js:', e);
    }
  }

  const classie = {
    add: (el: Element | null | undefined, cls: string) => el?.classList.add(cls),
    remove: (el: Element | null | undefined, cls: string) => el?.classList.remove(cls),
    has: (el: Element | null | undefined, cls: string) => el?.classList.contains(cls),
  };

  function setNavigationState() {
    if (!levelUpCtrl || !levelDownCtrl) return;
    if (selectedLevel === 1) {
      classie.add(levelDownCtrl, 'boxbutton--disabled');
    } else {
      classie.remove(levelDownCtrl, 'boxbutton--disabled');
    }

    if (selectedLevel === mallLevelsTotal) {
      classie.add(levelUpCtrl, 'boxbutton--disabled');
    } else {
      classie.remove(levelUpCtrl, 'boxbutton--disabled');
    }
  }

  function showPins(levelEl?: Element) {
    const el = levelEl || (selectedLevel ? mallLevels[selectedLevel - 1] : null);
    if (el) classie.add(el.querySelector('.level__pins'), 'level__pins--active');
  }

  function removePins(levelEl?: Element) {
    const el = levelEl || (selectedLevel ? mallLevels[selectedLevel - 1] : null);
    if (el) classie.remove(el.querySelector('.level__pins'), 'level__pins--active');
  }

  function hideSurroundings() {
    mallSurroundings.forEach(el => classie.add(el, 'surroundings--hidden'));
  }

  function showSurroundings() {
    mallSurroundings.forEach(el => classie.remove(el, 'surroundings--hidden'));
  }

  function showSpace(sliding?: boolean) {
    if (!spaceref) return;
    const contentItem = contentEl?.querySelector(`.content__item[data-space="${spaceref}"]`);
    if (contentItem) classie.add(contentItem, 'content__item--current');
    if (sliding && contentEl) classie.add(contentEl, 'content--open');

    // Highlight shape SVG (Phòng dạng hình khối)
    const shape = mallLevelsEl?.querySelector(`.map__space[data-space="${spaceref}"]`);
    if (shape) {
      classie.add(shape, 'map__space--selected');
      // Tìm và gán class vào group cha .room-group để kích hoạt transform 3D
      const group = shape.closest('.room-group');
      if (group) classie.add(group, 'room-group--selected');
    }

    // Pin (nếu còn dùng)
    const pin = mallLevelsEl?.querySelector(`.pin[data-space="${spaceref}"]`);
    if (pin) classie.add(pin, 'pin--active');
    
    // Gọi callback đồng bộ React state
    if (onSelectRoom) onSelectRoom(spaceref);
  }

  function hideSpace() {
    if (!spaceref) return;
    const contentItem = contentEl?.querySelector(`.content__item[data-space="${spaceref}"]`);
    if (contentItem) classie.remove(contentItem, 'content__item--current');

    // Remove highlight shape
    const shape = mallLevelsEl?.querySelector(`.map__space[data-space="${spaceref}"]`);
    if (shape) {
      classie.remove(shape, 'map__space--selected');
      const group = shape.closest('.room-group');
      if (group) classie.remove(group, 'room-group--selected');
    }

    const pin = mallLevelsEl?.querySelector(`.pin[data-space="${spaceref}"]`);
    if (pin) classie.remove(pin, 'pin--active');

    const activeItem = spacesListEl?.querySelector('li.list__item--active');
    if (activeItem) classie.remove(activeItem, 'list__item--active');
    
    if (onSelectRoom) onSelectRoom(null);
  }

  function openContentArea() {
    isOpenContentArea = true;
    showSpace(true);
    classie.remove(contentCloseCtrl, 'content__button--hidden');
    classie.add(mall, 'mall--content-open');
    classie.add(levelDownCtrl, 'boxbutton--disabled');
    classie.add(levelUpCtrl, 'boxbutton--disabled');
  }

  function closeContentArea() {
    if (contentEl) classie.remove(contentEl, 'content--open');
    hideSpace();
    classie.add(contentCloseCtrl, 'content__button--hidden');
    classie.remove(mall, 'mall--content-open');
    if (isExpanded) setNavigationState();
    isOpenContentArea = false;
  }

  function openContent(spacerefval: string) {
    if (isOpenContentArea) {
      hideSpace();
      spaceref = spacerefval;
      showSpace();
    } else {
      spaceref = spacerefval;
      openContentArea();
    }

    const listItem = spacesListEl?.querySelector(`li[data-space="${spacerefval}"]`);
    if (listItem) classie.add(listItem, 'list__item--active');
  }

  function showLevel(level: number) {
    if (isExpanded) return;
    selectedLevel = level;
    setNavigationState();
    classie.add(mallLevelsEl, `levels--selected-${selectedLevel}`);
    const levelEl = mallLevels[selectedLevel - 1];
    classie.add(levelEl, 'level--current');

    setTimeout(() => {
      classie.add(mallLevelsEl, 'levels--open');
      showPins();
      isExpanded = true;
    }, 300);

    hideSurroundings();
    classie.remove(mallNav, 'mallnav--hidden');

    if (spacesList) {
      spacesList.filter((item: any) => item.values().level === selectedLevel?.toString());
    }
  }

  function showAllLevels() {
    if (isNavigating || !isExpanded) return;
    isExpanded = false;
    if (selectedLevel) {
      classie.remove(mallLevels[selectedLevel - 1], 'level--current');
      classie.remove(mallLevelsEl, `levels--selected-${selectedLevel}`);
    }
    classie.remove(mallLevelsEl, 'levels--open');
    removePins();
    showSurroundings();
    classie.add(mallNav, 'mallnav--hidden');
    if (isOpenContentArea) closeContentArea();

    if (spacesList) spacesList.filter();
  }

  function navigate(direction: 'Up' | 'Down') {
    if (isNavigating || !isExpanded || isOpenContentArea || !selectedLevel) return;
    isNavigating = true;

    const prevLevel = selectedLevel;
    if (direction === 'Up' && selectedLevel > 1) {
      selectedLevel--;
    } else if (direction === 'Down' && selectedLevel < mallLevelsTotal) {
      selectedLevel++;
    } else {
      isNavigating = false;
      return;
    }

    setNavigationState();
    const currentEl = mallLevels[prevLevel - 1];
    classie.add(currentEl, `level--moveOut${direction}`);
    const nextEl = mallLevels[selectedLevel - 1];
    classie.add(nextEl, 'level--current');

    setTimeout(() => {
      classie.remove(currentEl, `level--moveOut${direction}`);
      classie.remove(currentEl, 'level--current');
      classie.remove(mallLevelsEl, `levels--selected-${prevLevel}`);
      classie.add(mallLevelsEl, `levels--selected-${selectedLevel}`);
      showPins();
      isNavigating = false;
    }, 600);

    removePins(currentEl);
    if (spacesList) {
      spacesList.filter((item: any) => item.values().level === selectedLevel?.toString());
    }
  }

  function openSearch() {
    showAllLevels();
    classie.add(spacesListEl, 'spaces-list--open');
    classie.add(containerEl, 'container--overflow');
  }

  function closeSearch() {
    classie.remove(spacesListEl, 'spaces-list--open');
    classie.remove(containerEl, 'container--overflow');
  }

  // --- Gán Event Listeners ---
  const handlers: Array<[Element | null, string, (e: any) => void]> = [];

  mallLevels.forEach((level, pos) => {
    const h = () => showLevel(pos + 1);
    level.addEventListener('click', h);
    handlers.push([level, 'click', h]);
  });

  if (allLevelsCtrl) {
    const h = () => showAllLevels();
    allLevelsCtrl.addEventListener('click', h);
    handlers.push([allLevelsCtrl, 'click', h]);
  }

  if (levelUpCtrl) {
    const h = () => navigate('Down');
    levelUpCtrl.addEventListener('click', h);
    handlers.push([levelUpCtrl, 'click', h]);
  }

  if (levelDownCtrl) {
    const h = () => navigate('Up');
    levelDownCtrl.addEventListener('click', h);
    handlers.push([levelDownCtrl, 'click', h]);
  }

  if (openSearchCtrl) {
    const h = () => openSearch();
    openSearchCtrl.addEventListener('click', h);
    handlers.push([openSearchCtrl, 'click', h]);
  }

  if (closeSearchCtrl) {
    const h = () => closeSearch();
    closeSearchCtrl.addEventListener('click', h);
    handlers.push([closeSearchCtrl, 'click', h]);
  }

  if (sortByNameCtrl) {
    const h = () => {
      if (sortByNameCtrl.checked) {
        classie.remove(spacesEl, 'grouped-by-category');
        if (spacesList) spacesList.sort('list__link');
      } else {
        classie.add(spacesEl, 'grouped-by-category');
        if (spacesList) spacesList.sort('category');
      }
    };
    sortByNameCtrl.addEventListener('click', h);
    handlers.push([sortByNameCtrl, 'click', h]);
  }

  // Support click on SVG Shapes (Room blocks) and Pin points
  const shapes = Array.from(mallLevelsEl.querySelectorAll('.map__space[data-space], .map__pin-point[data-space]'));
  shapes.forEach(shape => {
    const spaceId = shape.getAttribute('data-space');
    const h = (e: Event) => {
      e.stopPropagation();
      if (spaceId) openContent(spaceId);
    };
    shape.addEventListener('click', h);
    handlers.push([shape, 'click', h]);
  });

  pins.forEach(pin => {
    const spaceId = pin.getAttribute('data-space');
    const contentItem = contentEl.querySelector(`.content__item[data-space="${spaceId}"]`);

    const hEnter = () => { if (!isOpenContentArea) classie.add(contentItem, 'content__item--hover'); };
    const hLeave = () => { if (!isOpenContentArea) classie.remove(contentItem, 'content__item--hover'); };
    const hClick = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      if (spaceId) openContent(spaceId);
      classie.remove(contentItem, 'content__item--hover');
    };

    pin.addEventListener('mouseenter', hEnter);
    pin.addEventListener('mouseleave', hLeave);
    pin.addEventListener('click', hClick);
    handlers.push([pin, 'mouseenter', hEnter], [pin, 'mouseleave', hLeave], [pin, 'click', hClick]);
  });

  if (contentCloseCtrl) {
    const h = () => closeContentArea();
    contentCloseCtrl.addEventListener('click', h);
    handlers.push([contentCloseCtrl, 'click', h]);
  }

  spaces.forEach(space => {
    const spaceItem = space.parentElement;
    const level = spaceItem?.getAttribute('data-level');
    const spaceId = spaceItem?.getAttribute('data-space');
    const h = (e: Event) => {
      e.preventDefault();
      closeSearch();
      if (level) showLevel(parseInt(level));
      if (spaceId) openContent(spaceId);
    };
    space.addEventListener('click', h);
    handlers.push([space, 'click', h]);
  });

  return () => {
    handlers.forEach(([el, type, fn]) => el?.removeEventListener(type, fn));
  };
}
