module.exports = class CovidTallyPubSub {
    constructor(country, casesactive, casescritical, casestotal, deathstotalDeaths, teststotalTests, day, time) {
        this.country = country
        this.casesactive = casesactive
        this.casescritical = casescritical
        this.casestotal = casestotal
        this.deathstotalDeaths = deathstotalDeaths
        this.teststotalTests = teststotalTests
        this.day = day
        this.time = time
    }
}