import { Dataset, createCheerioRouter } from 'crawlee';
import { output } from '../utilities/exampleOutput.js';
import { changeDateFormat } from '../utilities/changeDateFormat.js'


const cheerioRouter = createCheerioRouter();

cheerioRouter.addDefaultHandler(async ({ enqueueLinks, request, $, log }) => {

    //general
    let result = { ...output }
    const title = $('title').text();
    log.info(`${title}`, { url: request.loadedUrl });

    //event
    result.event.name = $("h1").text()
    result.event.sourceInformation.sourceUrl = request.loadedUrl
    result.event.sourceInformation.retrievalDate = new Date().toISOString()
    result.event.description = $(".block.forcewrap").text()
    result.event.startDateTime = changeDateFormat($("time[itemprop='startDate']").attr("datetime"), $("time[itemprop='startDate']").text())
    result.event.endDateTime = changeDateFormat($("time[itemprop='endDate']").attr("datetime"), $("time[itemprop='endDate']").text())
    const admissionInformation = []

    $("table.default.vtop.prices tr").each(function () {
        admissionInformation.push({
            amount: $(".nowrap.right.incfee", this).text().trim(),
            currency: $(":nth-child(2)", this).text().trim(),
            category: $(".rrpad", this).text().trim().slice(0, -1)
        })
    })

    result.event.admissionInformation = admissionInformation

    let numberOfInterestees = 0
    let numberOfAttendees = 0

    $("table.fw.vtop.default tr").each(function () {
        const interested = Number($(":contains('geïnteresseerd') td.right", this).text())
        const visitors = Number($(":contains('bezoekers') td.right", this).text())

        numberOfInterestees += interested
        numberOfAttendees += visitors
    })

    $("table.fw.vtop.default tr").each(function () {
        const interested = Number($(":contains('geïnteresseerd') td.right", this).text())
        const visitors = Number($(":contains('bezoekers') td.right", this).text())

        numberOfInterestees += interested
        numberOfAttendees += visitors
    })

    result.event.status = $("div.sold-out").text()

    $("div[class=block] > div[class] > a", "div.party.box > div.box-column").each(function () {
        result.event.tags.push($(this).text())
    })

    result.event.numberOfInterestees = numberOfInterestees
    result.event.numberOfAttendees = numberOfAttendees

    result.event.ticketUrls = [$("div.event-actions.noncust.block > a:contains('Koop tickets')").attr("href")]


    //enqueueing location
    result.location.name = $("span[itemprop='name']", "span[itemprop='location']").text()

    log.info(`enqueueing URL for location`);
    await enqueueLinks({
        label: 'location',
        forefront: true,
        selector: "span[itemprop='location'] > a[href^='/location/']",
        userData: {...result},
    });


    //enqueueing organizer
    log.info(`enqueueing URL for organizer`);
    await enqueueLinks({
        label: 'organizer',
        forefront: true,
        selector: "div.party.box span[itemprop='organizer'] > a[itemprop='url']",
        userData: {...result},
    });


    console.log("dobehl default handler")
});




//collecting location
cheerioRouter.addHandler('location', async ({ request, $, log }) => {
    const title = $('title').text();
    log.info(`${title}`, { url: request.loadedUrl });

    let result = request.userData
    result.location.description = $("#biobody").text()
    result.location.sourceInformation.uuid = request.url.split("/")[4]
    result.location.sourceInformation.sourceUrl = request.url
    result.location.sourceInformation.retrievalDate = new Date().toISOString()
    result.location.websiteUrls.push($("a[title]", "table.nodyn.deflist.vtop tr:contains('Site')").attr("title"))
    result.location.address.country = $("span[itemprop='addressCountry']", "table.nodyn.deflist.vtop tr:contains('Adres')").text()

    result.location.address.street = $("span[itemprop='streetAddress']", "table.nodyn.deflist.vtop tr:contains('Adres')").text()
    result.location.address.houseNumber = result.location.address.street.match(/\d+$/)
    result.location.address.street = result.location.address.street.replace(` ${result.location.address.houseNumber}`, "")

    result.location.address.postalCode = $("span[itemprop='postalCode']", "table.nodyn.deflist.vtop tr:contains('Adres')").text()
    result.location.address.city = $("span[itemprop='addressLocality']", "table.nodyn.deflist.vtop tr:contains('Adres')").text()
    result.location.address.rawAddress = `${result.location.address.street} ${result.location.address.houseNumber} ${result.location.address.country}`


    console.log("zpracovavam location")

    // await Dataset.pushData({
    //     location: true
    // });
});




//collecting organizer
cheerioRouter.addHandler('organizer', async ({ request, $, log }) => {
    const title = $('title').text();
    log.info(`${title}`, { url: request.loadedUrl });

    let result = request.userData
    console.log("zpracovavam organizer")

    // await Dataset.pushData({
    //     organizer: true,
    // });
});



export { cheerioRouter }