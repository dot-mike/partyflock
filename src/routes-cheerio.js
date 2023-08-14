import { createCheerioRouter } from "crawlee";
import { changeDateFormat } from "../utilities/changeDateFormat.js";
import { Actor } from "apify";

const cheerioRouter = createCheerioRouter();

cheerioRouter.addDefaultHandler(
  async ({ enqueueLinks, request, $, log, proxyInfo }) => {
    const title = $("title").text();
    log.info(`${title}`, { url: request.loadedUrl }, proxyInfo);
    let result = {
      event: {
        name: $("h1").text() || null,
        sourceInformation: {
          uuid: request.url.split("/")[4],
          //sourceId: "URL", might be added for a customer later
          sourceUrl: request.url,
          //plattform: "https://partyflock.nl", might be added for a customer later
          retrievalDate: new Date().toISOString(),
          //urlToEvidenceFile: "", might be added for a customer later
          //urlToHtmlFile: "", might be added for a customer later
          //sourceDataLocalization: "nl", might be added for a customer later
        },
        description: $(".block.forcewrap").text() || null,
        startDateTime: changeDateFormat(
          $("time[itemprop='startDate']").attr("datetime"),
          $("time[itemprop='startDate']").text()
        ),
        endDateTime: changeDateFormat(
          $("time[itemprop='endDate']").attr("datetime"),
          $("time[itemprop='endDate']").text()
        ),
        status: $("div.sold-out").text() || null,
        //isOnline: "", might be added for a customer later
        //category: "", might be added for a customer later
        tags: [],
        admissionInformation: [],
        numberOfInterestees: 0,
        numberOfAttendees: 0,
        ticketUrls: [
          $("div.event-actions.noncust.block > a:contains('Buy tickets')").attr(
            "href"
          ),
        ],
      },
      location: {},
      organizers: [],
      artists: [],
    };

    $("table.default.vtop.prices tr").each(function () {
      const admissionString = $(":nth-child(2)", this).text().trim();

      if (/free/.test(admissionString)) {
        result.event.admissionInformation.push({
          admissionString,
          amount: "free",
          currency: "N/A",
          category: $(".rrpad", this).text().trim().slice(0, -1),
        });
      } else if (/more/.test(admissionString)) {
        result.event.admissionInformation.push({
          admissionString,
          amount: "more",
          currency: "N/A",
          category: $(".rrpad", this).text().trim().slice(0, -1),
        });
      } else {
        const pattern = /[0-9]/g;
        let firstOccOfNb = "";
        let lastOccOfNb = "";

        while (pattern.test(admissionString) == true) {
          firstOccOfNb = admissionString.match(/[0-9]/).index;
          lastOccOfNb = pattern.lastIndex;
        }

        result.event.admissionInformation.push({
          admissionString,
          amount: admissionString.substring(firstOccOfNb, lastOccOfNb),
          currency: admissionString.substring(0, firstOccOfNb),
          category: $(".rrpad", this).text().trim().slice(0, -1),
        });
      }
    });

    $("table.fw.vtop.default tr").each(function () {
      const interested = Number(
        $(":contains('interested') td.right", this).text()
      );
      const visitors = Number($(":contains('visitors') td.right", this).text());

      result.event.numberOfInterestees += interested;
      result.event.numberOfAttendees += visitors;
    });

    $("div.box-column a[href^='/agenda/']:not(time a)").each(function () {
      result.event.tags.push($(this).text());
    });

    //collecting Urls and enqueueing new bined requests which info should be included in 1 common dataset
    result.organizerUrls = [];
    $("div.party.box span[itemprop='organizer'] > a[itemprop='url']").each(
      function () {
        result.organizerUrls.push($(this).attr("href"));
      }
    );

    result.artistUrls = [];
    $("table.lineup  tr span[itemprop='performer'] a[itemprop='url']").each(
      function () {
        result.artistUrls.push($(this).attr("href"));
      }
    );

    result.locationUrls = [];
    $("span[itemprop='location'] > a[href^='/location/']").each(function () {
      result.locationUrls.push(`https://partyflock.nl${$(this).attr("href")}`);
    });

    if (result.locationUrls.length > 0) {
      log.info(`enqueueing URL for location`);
      await enqueueLinks({
        label: "details",
        forefront: true,
        urls: result.locationUrls,
        userData: result,
        transformRequestFunction: (request) => {
          request.uniqueKey = new Date().toISOString();
          return request;
        },
      });
    } else if (result.organizerUrls.length > 0) {
      log.info(`enqueueing URL for organizer`);
      await enqueueLinks({
        label: "details",
        forefront: true,
        urls: [result.organizerUrls[0]],
        userData: result,
        transformRequestFunction: (request) => {
          request.uniqueKey = new Date().toISOString();
          return request;
        },
      });
    } else if (result.artistUrls.length > 0) {
      log.info(`enqueueing URL for artist`);
      await enqueueLinks({
        label: "details",
        forefront: true,
        urls: [result.artistUrls[0]],
        userData: result,
        transformRequestFunction: (request) => {
          request.uniqueKey = new Date().toISOString();
          return request;
        },
      });
    } else {
      delete result.organizerUrls;
      delete result.artistUrls;
      delete result.locationUrls;

      await Actor.pushData({
        ...result,
      });
    }
  }
);

//////////////////////////////////////////////////////////////////////////////////////////////
//collecting location / organizer / artist
cheerioRouter.addHandler(
  "details",
  async ({ request, $, log, enqueueLinks, proxyInfo }) => {
    const title = $("title").text();
    log.info(`${title}`, { url: request.loadedUrl }, proxyInfo);
    //console.log(proxyInfo)

    let result = request.userData;

    let tags = [];
    $("div.box-column a[href^='/agenda/']:not(time a)").each(function () {
      tags.push($(this).text());
    });

    let street =
      $(
        "span[itemprop='streetAddress']",
        "table.nodyn.deflist.vtop tr:contains('Address')"
      ).text() || null;
    //house number parsing can be added later for the customer, ajdusting for specific country is needed
    //let houseNumber = street.match(/\d+$/) //is it useful?
    //street = street.replace(` ${houseNumber}`, null) //is it useful?
    let city =
      $(
        "span[itemprop='addressLocality']",
        "table.nodyn.deflist.vtop tr:contains('Address')"
      ).text() || null;
    let country =
      $(
        "span[itemprop='addressCountry']",
        "table.nodyn.deflist.vtop tr:contains('Address')"
      ).text() || null;
    let postalCode =
      $(
        "span[itemprop='postalCode']",
        "table.nodyn.deflist.vtop tr:contains('Address')"
      ).text() || null;
    let emailAddresses = $(
      "a",
      "table.nodyn.deflist.vtop tr:contains('E-mail')"
    ).text();
    emailAddresses === ""
      ? (emailAddresses = null)
      : (emailAddresses = emailAddresses);

    let phoneNumbers = $(
      "a",
      "table.nodyn.deflist.vtop tr:contains('Phone')"
    ).text();

    phoneNumbers === "" ? (phoneNumbers = null) : (phoneNumbers = phoneNumbers);

    let object = {
      name: $("h1").text() || null,
      description: null,
      sourceInformation: {
        uuid: request.url.split("/")[4],
        //sourceId: "URL",
        sourceUrl: request.url,
        //plattform: "https://partyflock.nl",
        retrievalDate: new Date().toISOString(), //check time
        // urlToEvidenceFile: "", //todo
        //urlToHtmlFile: "", //todo
        // sourceDataLocalization: "nl",
      },
      websiteUrls: [
        $("a[title]", "table.nodyn.deflist.vtop tr:contains('Site')").attr(
          "title"
        ),
      ],
      phoneNumbers: [phoneNumbers],
      emailAddresses: [emailAddresses],
      //category: "", //not found to be eventually added later for the customer
      tags: tags,
      address: {
        //countryCode: "nl", to be eventually added later for the customer
        street: street,
        //houseNumber: houseNumber, can be added later for the customer
        postalCode: postalCode,
        city: city,
        country: country,
        //state: "", to be eventually added later for the customer
        //region: "",to be eventually added later for the customer
        rawAddress: `${street} ${city} ${postalCode}  ${country}`,
      },
    };

    while (
      object.address.rawAddress !== null &&
      object.address.rawAddress.trim().startsWith("null")
    ) {
      object.address.rawAddress = object.address.rawAddress.replace("null", "");
      if (object.address.rawAddress.trim() === "") {
        object.address.rawAddress = null;
      }
    }

    if (result.locationUrls.length > 0) {
      result.locationUrls.shift();
      object.description = $("#biobody").text() || null;
      result.location = object;
    }

    if (result.organizerUrls.length > 0) {
      if (request.loadedUrl === result.organizerUrls[0]) {
        result.organizerUrls.shift();
        delete object.description;
        result.organizers.push(object);
      }

      if (result.organizerUrls.length > 0) {
        log.info(`enqueueing URL for organizer`);
        await enqueueLinks({
          userData: result,
          forefront: true,
          urls: [result.organizerUrls[0]],

          transformRequestFunction: (request) => {
            request.uniqueKey = new Date().toISOString();
            return request;
          },
        });
      }
    }

    if (result.organizerUrls.length === 0 && result.artistUrls.length > 0) {
      if (request.loadedUrl === result.artistUrls[0]) {
        result.artistUrls.shift();
        delete object.description;
        result.artists.push(object);
      }
      if (result.artistUrls.length > 0) {
        log.info(`enqueueing URL for artist`);
        await enqueueLinks({
          userData: result,
          forefront: true,
          urls: [result.artistUrls[0]],
          transformRequestFunction: (request) => {
            request.uniqueKey = new Date().toISOString();
            return request;
          },
        });
      }
    }

    if (
      result.locationUrls.length === 0 &&
      result.organizerUrls.length === 0 &&
      result.artistUrls.length === 0
    ) {
      delete result.organizerUrls;
      delete result.artistUrls;
      delete result.locationUrls;
      delete result.label;

      await Actor.pushData({
        ...result,
      });
    }
  }
);

export { cheerioRouter };
