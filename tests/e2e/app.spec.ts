import { expect, test, type Page } from '@playwright/test';

function mockSpeechRecognition(page: Page, transcript: string) {
	return page.addInitScript((t) => {
		class MockRecognition {
			lang = '';
			continuous = false;
			interimResults = false;
			onstart: (() => void) | null = null;
			onresult: ((event: unknown) => void) | null = null;
			onerror: ((event: unknown) => void) | null = null;
			onend: (() => void) | null = null;

			start() {
				setTimeout(() => {
					this.onstart?.();
					this.onresult?.({
						resultIndex: 0,
						results: [{ isFinal: true, 0: { transcript: t } }]
					});
					this.onend?.();
				}, 50);
			}

			stop() {
				this.onend?.();
			}

			abort() {}
		}

		const win = window as unknown as Record<string, unknown>;
		win.SpeechRecognition = MockRecognition;
		win.webkitSpeechRecognition = MockRecognition;
	}, transcript);
}

async function waitForApp(page: Page) {
	await page.goto('/');
	await expect(page.getByText('Running low', { exact: false }).first()).toBeVisible();
}

test.beforeEach(async ({ page }) => {
	await page.addInitScript(() => localStorage.clear());
});

test('adds an item by voice', async ({ page }) => {
	await mockSpeechRecognition(page, 'add 2 bottles of water');
	await waitForApp(page);

	await page.getByRole('button', { name: 'Start listening' }).click();

	await expect(page.getByRole('heading', { name: 'Beverages' })).toBeVisible();
	await expect(page.getByText('water', { exact: true })).toBeVisible();
	await expect(page.getByText('2 bottles', { exact: true })).toBeVisible();
});

test('adds and removes an item by typed input', async ({ page }) => {
	await waitForApp(page);

	const input = page.getByPlaceholder(/Or type an item/);
	await input.fill('add milk');
	await input.press('Enter');

	await expect(page.getByRole('heading', { name: 'Dairy' })).toBeVisible();
	await expect(page.getByText('milk', { exact: true })).toBeVisible();

	await input.fill('remove milk from my list');
	await input.press('Enter');

	await expect(page.getByText('milk', { exact: true })).toHaveCount(0);
});

test('shows suggestions and voice search results', async ({ page }) => {
	await waitForApp(page);

	await expect(page.getByText('Running low', { exact: false }).first()).toBeVisible();

	const input = page.getByPlaceholder(/Or type an item/);
	await input.fill('find toothpaste under $5');
	await input.press('Enter');

	await expect(page.getByRole('heading', { name: /Results for/ })).toBeVisible();
	await expect(page.getByText('Colgate · 200 g')).toBeVisible();
});
