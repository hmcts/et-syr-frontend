describe('navigation-click-guard', () => {
  const createLinks = () => {
    const link1 = document.createElement('a');
    link1.setAttribute('href', '#one');
    link1.setAttribute('data-navigation-link', '');

    const link2 = document.createElement('a');
    link2.setAttribute('href', '#two');
    link2.setAttribute('data-navigation-link', '');

    const other = document.createElement('a');
    other.setAttribute('href', '#other');

    document.body.appendChild(link1);
    document.body.appendChild(link2);
    document.body.appendChild(other);

    return { link1, link2, other } as const;
  };

  beforeEach(() => {
    document.body.innerHTML = '';
    jest.resetModules();
  });

  test('allows first click and blocks subsequent clicks on the same link', async () => {
    const { link1 } = createLinks();

    await import('../../../main/assets/js/navigation-click-guard');

    const first = new MouseEvent('click', { bubbles: true, cancelable: true });
    const firstPrevent = jest.spyOn(first, 'preventDefault');
    const firstResult = link1.dispatchEvent(first);

    expect(firstPrevent).not.toHaveBeenCalled();
    expect(firstResult).toBe(true); // not canceled

    const second = new MouseEvent('click', { bubbles: true, cancelable: true });
    const secondPrevent = jest.spyOn(second, 'preventDefault');
    const secondResult = link1.dispatchEvent(second);

    expect(secondPrevent).toHaveBeenCalledTimes(1);
    expect(secondResult).toBe(false); // canceled
  });

  test('independent links are tracked separately', async () => {
    const { link1, link2 } = createLinks();

    await import('../../../main/assets/js/navigation-click-guard');

    // First click on each should pass
    expect(link1.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))).toBe(true);
    expect(link2.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))).toBe(true);

    // Second click on each should be blocked
    const e1 = new MouseEvent('click', { bubbles: true, cancelable: true });
    const e2 = new MouseEvent('click', { bubbles: true, cancelable: true });
    const p1 = jest.spyOn(e1, 'preventDefault');
    const p2 = jest.spyOn(e2, 'preventDefault');

    expect(link1.dispatchEvent(e1)).toBe(false);
    expect(link2.dispatchEvent(e2)).toBe(false);
    expect(p1).toHaveBeenCalled();
    expect(p2).toHaveBeenCalled();
  });

  test('does not attach to links without data-navigation-link', async () => {
    const { other } = createLinks();

    await import('../../../main/assets/js/navigation-click-guard');

    const e1 = new MouseEvent('click', { bubbles: true, cancelable: true });
    const p1 = jest.spyOn(e1, 'preventDefault');
    const res = other.dispatchEvent(e1);

    expect(p1).not.toHaveBeenCalled();
    expect(res).toBe(true);
  });

  test('clears state on window pageshow and allows click again', async () => {
    const { link1 } = createLinks();

    await import('../../../main/assets/js/navigation-click-guard');

    // First click allowed
    expect(link1.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))).toBe(true);
    // Second click blocked
    expect(link1.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))).toBe(false);

    // Simulate bfcache restore/pageshow which should clear internal state
    window.dispatchEvent(new Event('pageshow'));

    // Click should be allowed again after pageshow
    const after = new MouseEvent('click', { bubbles: true, cancelable: true });
    const preventSpy = jest.spyOn(after, 'preventDefault');
    const res = link1.dispatchEvent(after);

    expect(preventSpy).not.toHaveBeenCalled();
    expect(res).toBe(true);
  });
});
