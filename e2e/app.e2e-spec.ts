import { PuppemailPage } from './app.po';

describe('puppemail App', function() {
  let page: PuppemailPage;

  beforeEach(() => {
    page = new PuppemailPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
