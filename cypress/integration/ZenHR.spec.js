import { loginPage, userPage } from '../locators/index';
import pages from '../fixtures/pages.json';
import utils from '../src/utils';

describe('ZenHR', () => {

	it('Checking the availability of the links, @ID: 01', () => {
		const importantAPIs = ['events','holidays','employees','birthday'];
		cy.intercept('GET', '/en/events*').as('events');
		cy.intercept('GET', '/en/holidays/calendar_holidays*').as('holidays');
		cy.intercept('POST', '/en/employees/53497/timeoff_balances').as('employees');
		cy.intercept('GET', '/en/dashboard/employees_with_upcoming_birthdays*').as('birthday');

		cy.visit('/en/users/sign_in');
		cy.url().should('include', '/en/users/sign_in');
		cy.get(loginPage.userNameInput).type(pages.login.userName, { force: true });
		cy.get(loginPage.passwordInput).type(pages.login.password, { force: true });
		cy.get(loginPage.loginButton).click({ force: true });
		cy.get(userPage.snackbar).should('contain.text', pages.login.successfulSignIn);
		cy.url().should('include', '/en/dashboard');
		importantAPIs.forEach((alias)=>{
			utils.waitForSuccessfulStatus(`@${alias}`);
		});
		cy.get(userPage.allLinks).each((link) => {
			cy.request({
				url: link.prop('href'),
				failOnStatusCode: false,
				headers: {
					'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9\'',
				},
			})
				.its('status').should('eq', 200);
		});
		// Sign Out
		cy.get(userPage.settingsDropdown).click();
		cy.get(userPage.logoutButton).click();
		cy.url().should('include', '/en/logout');

	});
});
