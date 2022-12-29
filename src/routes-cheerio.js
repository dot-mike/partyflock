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
            amount: Number($(".nowrap.right.incfee", this).text().trim()),
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

    //collecting Urls and enqueueing new bined requests
    result.organizerUrls = []
    $("div.party.box span[itemprop='organizer'] > a[itemprop='url']").each(function () {
        result.organizerUrls.push($(this).attr("href"))
    })

    result.artistUrls = []
    $("table.lineup  tr span[itemprop='performer'] a[itemprop='url']").each(function () {
        result.artistUrls.push($(this).attr("href"))
    })

    const location = []
    $("span[itemprop='location'] > a[href^='/location/']").each(function () {
        location.push(`https://partyflock.nl${$(this).attr("href")}`)
    })
    console.log(location)

    if (location.length > 0) {
        log.info(`enqueueing URL for location`);
        await enqueueLinks({
            label: 'location',
            forefront: true,
            urls: location,
            userData: result,
        });
    }
    else if (result.organizerUrls.length > 0) {
        //enqueueing organizer
        request.userData.label = "organizer"
        log.info(`enqueueing URL for organizer`);
        await enqueueLinks({
            userData: result,
            forefront: true,
            urls: [result.organizerUrls[0]],
        });
    }
    else if (result.artistUrls.length > 0) {
        //enqueueing artist
        request.userData.label = "artist"
        log.info(`enqueueing URL for artist`);
        await enqueueLinks({
            userData: result,
            forefront: true,
            urls: [result.artistUrls[0]],
        });
    }
    else {
        console.log("dataset pushed")
        await Dataset.pushData({
            ...result
        });
    }
});


//////////////////////////////////////////////////////////////////////////////////////////////
//collecting location
cheerioRouter.addHandler('location', async ({ request, $, log, enqueueLinks }) => {
    const title = $('title').text();
    log.info(`${title}`, { url: request.loadedUrl });

    let result = request.userData
    result.location.name = $("h1").text() //stejny pro vsechny
    result.location.description = $("#biobody").text() //pouze location
    result.location.sourceInformation.uuid = request.url.split("/")[4] //stejny pro vsechny
    result.location.sourceInformation.sourceUrl = request.url //stejny pro vsechny
    result.location.sourceInformation.retrievalDate = new Date().toISOString() //stejny pro vsechny
    result.location.websiteUrls.push($("a[title]", "table.nodyn.deflist.vtop tr:contains('Site')").attr("title")) //stejny pro vsechny
    result.location.emailAddresses.push($("a", "table.nodyn.deflist.vtop tr:contains('E-mail')").text()) //stejny pro vsechny

    result.location.address.country = $("span[itemprop='addressCountry']", "table.nodyn.deflist.vtop tr:contains('Adres')").text() //stejny pro vsechny
    result.location.address.street = $("span[itemprop='streetAddress']", "table.nodyn.deflist.vtop tr:contains('Adres')").text() //stejny pro vsechny
    result.location.address.houseNumber = result.location.address.street.match(/\d+$/) //stejny pro vsechny
    result.location.address.street = result.location.address.street.replace(` ${result.location.address.houseNumber}`, "") //stejny pro vsechny
    result.location.address.postalCode = $("span[itemprop='postalCode']", "table.nodyn.deflist.vtop tr:contains('Adres')").text()//stejny pro vsechny
    result.location.address.city = $("span[itemprop='addressLocality']", "table.nodyn.deflist.vtop tr:contains('Adres')").text()//stejny pro vsechny
    result.location.address.rawAddress = `${result.location.address.street} ${result.location.address.houseNumber} ${result.location.address.country}`//stejny pro vsechny


    console.log("zpracoval jsem location")


    //enqueueing bined request for organizers / artist
    if (result.organizerUrls.length > 0) {
        request.userData.label = "organizer"
        log.info(`enqueueing URL for organizer`);
        await enqueueLinks({
            userData: result,
            forefront: true,
            urls: [result.organizerUrls[0]],
        });
    }

    else if (result.artistUrls.length > 0) {
        request.userData.label = "artist"
        log.info(`enqueueing URL for artist`);
        await enqueueLinks({
            userData: result,
            forefront: true,
            urls: [result.artistUrls[0]],
        });
    }

    else {
        console.log("dataset pushed")
        await Dataset.pushData({
            ...result
        });
    }

});

//////////////////////////////////////////////////////////////////////////////////////////////
//collecting organizer
cheerioRouter.addHandler('organizer', async ({ enqueueLinks, request, $, log }) => {
    const title = $('title').text();
    log.info(`${title}`, { url: request.loadedUrl });

    let result = request.userData
    result.organizerUrls.shift()

    //sesbiraji se vsechny data do objektu a pak se podle toho zda jde o organizera nebo o artist da ten objekt do prislusny pozice + se vyresi par vyjimek u atributu (vypadaji ale vsichni stejne)




    //to be improved (currently collectinh also some dates)
    let tags = []
    $("div.organization a[href^='/agenda/']").each(function () {
        tags.push($(this).text())
    })

    let street = $("span[itemprop='streetAddress']", "table.nodyn.deflist.vtop tr:contains('Adres')").text()
    let houseNumber = street.match(/\d+$/) || ""
    street = street.replace(` ${houseNumber}`, "")
    let country = $("span[itemprop='addressCountry']", "table.nodyn.deflist.vtop tr:contains('Adres')").text()

    result.organizers.push({
        name: $("h1").text(),
        sourceInformation:
        {
            uuid: request.url.split("/")[4],
            sourceId: "",
            sourceUrl: request.url,
            plattform: "https://partyflock.nl",
            retrievalDate: new Date().toISOString(),
            urlToEvidenceFile: "",
            urlToHtmlFile: "",
            sourceDataLocalization: "nl",
        },
        websiteUrls: [$("a[title]", "table.nodyn.deflist.vtop tr:contains('Site')").attr("title")],
        phoneNumbers: [],
        emailAddresses: [[$("a", "table.nodyn.deflist.vtop tr:contains('E-mail')").text()] || []],
        category: "",
        tags: tags,
        address: {
            countryCode: "nl",
            country: country,
            street: street,
            houseNumber: houseNumber,
            postalCode: $("span[itemprop='postalCode']", "table.nodyn.deflist.vtop tr:contains('Adres')").text(),
            city: $("span[itemprop='addressLocality']", "table.nodyn.deflist.vtop tr:contains('Adres')").text(),
            state: "",
            region: "",
            rawAddress: `${street} ${houseNumber} ${country}`,
        }
    })

    console.log("zpracoval jsem organizer")

    if (result.organizerUrls.length > 0) {
        log.info(`enqueueing URL for organizer`);
        await enqueueLinks({
            userData: result,
            forefront: true,
            urls: [result.organizerUrls[0]],
        });
    }
    else {
        //enqueueing artists
        request.userData.label = "artist"
        log.info(`enqueueing URL for artist`);
        await enqueueLinks({
            userData: result,
            forefront: true,
            urls: [result.artistUrls[0]],
        });
    }
});


//////////////////////////////////////////////////////////////////////////////////////////////
//collecting artists
cheerioRouter.addHandler('artist', async ({ enqueueLinks, request, $, log }) => {
    const title = $('title').text();
    log.info(`${title}`, { url: request.loadedUrl });

    let result = request.userData
    result.artistUrls.shift()

    //to be improved (currently collectinh also some dates)
    let tags = []
    $("div.organization a[href^='/agenda/']").each(function () {
        tags.push($(this).text())
    })


    let street = $("span[itemprop='streetAddress']", "table.nodyn.deflist.vtop tr:contains('Adres')").text()
    let houseNumber = street.match(/\d+$/) || ""
    street = street.replace(` ${houseNumber}`, "")
    let country = $("span[itemprop='addressCountry']", "table.nodyn.deflist.vtop tr:contains('Adres')").text()

    result.artists.push({
        name: $("h1").text(),
        sourceInformation:
        {
            uuid: request.url.split("/")[4],
            sourceId: "",
            sourceUrl: request.url,
            plattform: "https://partyflock.nl",
            retrievalDate: new Date().toISOString(),
            urlToEvidenceFile: "",
            urlToHtmlFile: "",
            sourceDataLocalization: "nl",
        },
        websiteUrls: [$("a[title]", "table.nodyn.deflist.vtop tr:contains('Site')").attr("title")],
        phoneNumbers: [],
        emailAddresses: [[$("a", "table.nodyn.deflist.vtop tr:contains('E-mail')").text()] || []],
        category: "",
        tags: tags,
        address: {
            countryCode: "nl",
            country: country,
            street: street,
            houseNumber: houseNumber,
            postalCode: $("span[itemprop='postalCode']", "table.nodyn.deflist.vtop tr:contains('Adres')").text(),
            city: $("span[itemprop='addressLocality']", "table.nodyn.deflist.vtop tr:contains('Adres')").text(),
            state: "",
            region: "",
            rawAddress: `${street} ${houseNumber} ${country}`,
        }
    })

    console.log("zpracoval jsem artist")

    if (result.artistUrls.length > 0) {
        log.info(`enqueueing URL for artist`);
        await enqueueLinks({
            userData: result,
            forefront: true,
            urls: [result.artistUrls[0]],
        });
    }
    else {
        console.log("dataset pushed")
        await Dataset.pushData({
            ...result
        });
    }
});


export { cheerioRouter }


// co kdyz neni zadnej organizator => pak se nebudou crawlovat artists...
//teoreticky co kdyz bude chybet location
//nakonci musis vyndat ty org. a art. urls pole
//budou potreba cookies kvuli tomu jazyku (je to ted vazany na NL)
//blocking ip adres
//jsou webovky jen webovky nebo i social sites?
// je jmeno u artists realny jmeno nebo jmeno umelecky? https://partyflock.nl/artist/99414:AIROD
// chtej do country původ nebo rezidenstvi? https://partyflock.nl/artist/558:Rush
//pokud nechtej zadny info z artists tak muzu scrapnout jen artist name v eventu


//asi bude nejlepsi kdyz organizers a artists budou scrapovany stejnym handlerem a jen ty atributy budou dany podminkou
//kdyz radim ty requesty tak jim musim dat unique key pro artist/location/organizer nebo se mi nepridaj kdyz uz byly zpracovany pro jinou event 