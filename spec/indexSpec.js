describe("Index page functionality", function() {
  it("checks if URL is content", function() {
    var testCase = "https://www.netflix.com/watch/20559714?trackId=1";
    expect(isContentPage(testCase)).toBeTruthy();
  });
});
