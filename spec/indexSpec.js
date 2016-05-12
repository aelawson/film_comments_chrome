describe("Index page functionality", function() {

  it("expect URL to be content-URL", function() {
    var testCase = "https://www.netflix.com/watch/20559714?trackId=1";
    expect(isContentPage(testCase)).toBeTruthy();
  });

  it("expect URL to be non-content-URL", function() {
    var testCase = "https://www.netflix.com/browse";
    expect(isContentPage(testCase)).not.toBeTruthy();
  });

  it("expect URL to be non-content-URL", function() {
    var testCase = "https://www.netflix.com/browse";
    expect(isContentPage(testCase)).not.toBeTruthy();
  });

  it("expect content id to be extracted", function() {
    var testCase = "https://www.netflix.com/watch/20559714?trackId=1";
    expect(getContentId(testCase)).toEqual("20559714");
  });

  it("expect total time to be normalized in minutes", function() {
      var testCase1 = "2h 15m";
      var testCase2 = "1h 0m";
      var testCase3 = "0h 9m";
      expect(normalizeTimeTotal(testCase1)).toEqual(135);
      expect(normalizeTimeTotal(testCase2)).toEqual(60);
      expect(normalizeTimeTotal(testCase3)).toEqual(9);
  });

  it("expect remaining time to be normalized in seconds", function() {
    var testCase1 = "3:25:30";
    var testCase2 = "25:05";
    var testCase3 = "00:09";
    expect(normalizeTimeRemaining(testCase1)).toEqual(12330);
    expect(normalizeTimeRemaining(testCase2)).toEqual(1505);
    expect(normalizeTimeRemaining(testCase3)).toEqual(9);
  });

  it("expect source string to contain target", function() {
    var testSource = "these";
    var testTarget = "the";
    expect(stringContains(testSource, testTarget)).toBeTruthy();
  });

  it("expect source string to not contain target", function() {
      var testSource = "apple";
      var testTarget = "orange";
    expect(stringContains(testSource, testTarget)).not.toBeTruthy();
  });
});
