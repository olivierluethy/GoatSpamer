const { chromium } = require('playwright');

function randomDelay(min = 800, max = 2500) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function humanPause(page, min = 800, max = 2500) {
  await page.waitForTimeout(randomDelay(min, max));
}

async function randomScroll(page) {
  const scrollSteps = Math.floor(Math.random() * 5) + 3;

  for (let i = 0; i < scrollSteps; i++) {
    const distance = Math.floor(Math.random() * 600) + 200;

    await page.mouse.wheel(0, distance);
    await humanPause(page, 500, 1500);
  }
}

(async () => {
  const context = await chromium.launchPersistentContext('./playwright-profile', {
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });

  const page = await context.newPage();

  // ❗ COOKIE aus Umgebungsvariable LI_AT laden (nicht hardcoden!)
  const liAt = process.env.LI_AT;
  if (!liAt) {
    console.error('❌ Umgebungsvariable LI_AT ist nicht gesetzt. Beispiel: LI_AT="dein_cookie" node linkedin.spec.js');
    await context.close();
    process.exit(1);
  }

  await context.addCookies([
    {
      name: 'li_at',
      value: liAt,
      domain: '.linkedin.com',
      path: '/',
      httpOnly: true,
      secure: true
    }
  ]);

  await page.goto('https://www.linkedin.com/feed/');
  await humanPause(page, 2000, 4000);

  await page.goto('https://www.linkedin.com/mynetwork/grow/');
  await humanPause(page, 3000, 6000);

  let actions = 0;
  const MAX_ACTIONS = Math.floor(Math.random() * 5) + 5; // 5–10 Aktionen max

  while (actions < MAX_ACTIONS) {
    await randomScroll(page);

    const cards = await page.locator('div.discover-person-card');
    const count = await cards.count();

    if (count === 0) continue;

    const index = Math.floor(Math.random() * count);
    const card = cards.nth(index);

    const text = await card.innerText();

    const match = text.match(/(\d+)\s+(weitere gemeinsame Kontakte|mutual connections)/i);

    if (!match) continue;

    const number = parseInt(match[1], 10);

    if (number < 2) continue;

    console.log(`👉 Kandidat mit ${number} gemeinsamen Kontakten`);

    const profileLink = card.locator('a').first();

    await humanPause(page, 1000, 3000);
    await profileLink.click();

    await page.waitForLoadState('domcontentloaded');
    await humanPause(page, 3000, 6000);

    const isFollowing = await page.locator(
      'button:has-text("Following"), button:has-text("Follower")'
    ).count();

    if (isFollowing === 0) {
      const followButton = page.locator(
        'button:has-text("Follow"), button:has-text("Folgen")'
      );

      if (await followButton.count() > 0) {
        await humanPause(page, 1500, 4000);
        await followButton.first().click();
        console.log('✅ Gefolgt');
        actions++;
      }
    } else {
      console.log('⏭️ Bereits gefolgt');
    }

    await humanPause(page, 2000, 5000);

    await page.goBack();
    await page.waitForLoadState('domcontentloaded');

    await humanPause(page, 3000, 6000);
  }

  console.log(`🛑 Fertig – ${actions} Aktionen ausgeführt`);
})();