import { loginPage } from '../locators/index';
import pages from '../fixtures/pages.json';

describe('ZenHR', () => {
	it('Checking the availability of the links, @ID: 01', () => {
		cy.visit('/en/users/sign_in');
		cy.url().should('include', '/en');
		cy.get(loginPage.userNameInput).type(pages.login.userName, { force: true });
		cy.get(loginPage.passwordInput).type(pages.login.password, { force: true });
		cy.get(loginPage.loginButton).click({ force: true });
		cy.get(loginPage.snackbar).should('contain.text', pages.login.successfulSignIn);
		cy.get(loginPage.allLinks).each((link) => {
			cy.request({
				url: link.prop('href'),
				failOnStatusCode: false,
				headers: {
					'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9\'',
				},
			})
				.its('status').should('eq', 200);
		});
	});
});
