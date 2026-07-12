import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://ilias.unibe.ch/ilias.php?baseClass=ilobjsurveygui&cmd=infoScreen&ref_id=3676341');
  await page.getByRole('button', { name: 'Umfrage beginnen' }).click();
  await page.getByRole('textbox', { name: 'Antwort' }).click();
  await page.getByRole('textbox', { name: 'Antwort' }).click();
  await page.getByRole('textbox', { name: 'Antwort' }).fill('Unbedingt die Bibliothek');
  await page.locator('#nextButtonBottom').click();
  await page.getByRole('textbox', { name: 'Antwort' }).click();
  await page.getByRole('textbox', { name: 'Antwort' }).click();
  await page.getByRole('textbox', { name: 'Antwort' }).fill('Weil es für mich sehr viele verstecke bietet um mich meinem Pornhub Konsum zu widmen.');
  await page.locator('#nextButtonBottom').click();
  await page.getByRole('checkbox', { name: '6 Uhr' }).check();
  await page.getByRole('checkbox', { name: '6.30 Uhr' }).check();
  await page.getByRole('checkbox', { name: '7 Uhr' }).check();
  await page.locator('#nextButtonBottom').click();
  await page.getByRole('textbox', { name: 'Antwort' }).click();
  await page.getByRole('textbox', { name: 'Antwort' }).fill('Ich warte immer noch auf meinen Pornhub Premium Account. Dieser wurde von meinem Dozenten der Uni versprochen.');
  await page.locator('#nextButtonBottom').click();
  await page.getByRole('textbox', { name: 'Antwort' }).click();
  await page.getByRole('textbox', { name: 'Antwort' }).fill('Ich verlange einen Pornhub Zugang, weil sonst geht das nicht mehr weiter!\\n\\nHaben Sie mich verstanden?');
  await page.locator('#nextButtonBottom').click();
  await page.getByRole('button', { name: 'Bestätigen' }).click();
});