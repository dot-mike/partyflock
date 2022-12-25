import { Dataset, createCheerioRouter } from 'crawlee';
import { output } from '../utilities/exampleOutput.js';
import { changeDateFormat } from '../utilities/changeDateFormat.js'


const cheerioRouter = createCheerioRouter();

cheerioRouter.addDefaultHandler(async ({ enqueueLinks, request, $, log }) => {
    /*
    log.info(`enqueueing new URLs`);
    await enqueueLinks({
        globs: ['https://crawlee.dev/**'],
        label: 'detail',
    });
    */
    const title = $('title').text();
    log.info(`${title}`, { url: request.loadedUrl });

    output.event.name = $("h1").text()
    output.event.sourceInformation.sourceUrl = request.loadedUrl
    output.event.sourceInformation.retrievalDate = new Date().toISOString()
    output.event.description = $(".block.forcewrap").text()
    output.event.startDateTime = changeDateFormat($("time[itemprop='startDate']").attr("datetime"), $("time[itemprop='startDate']").text())
    output.event.endDateTime = changeDateFormat($("time[itemprop='endDate']").attr("datetime"), $("time[itemprop='endDate']").text())
    const admissionInformation = []

    $("table.default.vtop.prices tr").each(function () {
        admissionInformation.push({
            amount: $(".nowrap.right.incfee", this).text().trim(),
            currency: $(":nth-child(2)", this).text().trim(),
            category: $(".rrpad", this).text().trim().slice(0, -1)
        })
    })

    output.event.admissionInformation = admissionInformation

    let numberOfInterestees = 0
    let numberOfAttendees = 0

    $("table.fw.vtop.default tr").each(function () {
        const interested = Number($(":contains('geïnteresseerd') td.right", this).text())
        const visitors = Number($(":contains('bezoekers') td.right", this).text())
         
        numberOfInterestees += interested
        numberOfAttendees += visitors
    })

    output.event.numberOfInterestees = numberOfInterestees
    output.event.numberOfAttendees = numberOfAttendees
    
    output.event.ticketUrls= [$("div.event-actions.noncust.block > a:contains('Koop tickets')").attr("href")]
    




    await Dataset.pushData(output);
});

/**
cheerioRouter.addHandler('detail', async ({ request, $, log }) => {
    const title = $('title').text();
    log.info(`${title}`, { url: request.loadedUrl });

    await Dataset.pushData({
        url: request.loadedUrl,
        title,
    });
});
*/

export { cheerioRouter }