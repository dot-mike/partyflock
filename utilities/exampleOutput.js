export const output = {
    "event": {
        "name": "",
        "sourceInformation": {
            "uuid": "",
            "sourceId": "",
            "sourceUrl": "",
            "plattform": "www.partyflock.nl/",
            "retrievalDate": "2022-07-22T09:09:53.287Z", //prefered timezone?

            //todo
            //"urlToEvidenceFile": "39779224-deja-vu-at-well -club.pdf",
            //"urlToHtmlFile": "39779224-deja-vu-at-welly-club.html",
            //

            //should it be "nl" for partyflocker ??? => if not code needs to be changed as it sometimes relies on text e.g ticket url
            "sourceDataLocalization": "nl"
            //
        },
        "description": "",
        "startDateTime": "",
        "endDateTime": "",
        "status": "",//currently collecting only "Uitverkocht" in case of alert "sold out" 

        //not found
        "isOnline": "",
        "category": "",
        //

        "tags": [],
        "admissionInformation": [],

        "numberOfInterestees": "",
        "numberOfAttendees": "",
        "ticketUrls": [
        ]
    },

    "location": {
        "name": "",
        "description": "",
        "sourceInformation": {
            "uuid": "",
            "sourceId": "URL",
            "sourceUrl": "",
            "plattform": "https://partyflock.nl",
            "retrievalDate": "", //prefered timezone?

            //todo
            //"urlToEvidenceFile": "39779224-deja-vu-at-well -club.pdf",
            //"urlToHtmlFile": "39779224-deja-vu-at-welly-club.html",
            //

            "sourceDataLocalization": "nl" //should be always nl?
        },
        "websiteUrls": [],

        //not found
        "phoneNumbers": [],
        //

        "emailAddresses": [],

        //not found        
        "category": "dance_club",
        "tags": [
            "entertainment",
            "party"
        ],
        //

        "address": {
            //should be always nl?
            "countryCode": "nl",
            //

            "country": "",
            "street": "",
            "houseNumber": "",
            "postalCode": "",
            "city": "",

            //not found
            "state": "",
            "region": "",
            //

            "rawAddress": ""
        }
    },
    "organizers": [
        /*
         {
             "name": "",
             "sourceInformation": {
                 "uuid": "",
                 "sourceId": "",//
                 "sourceUrl": "",
                 "plattform": "https://partyflock.nl",
                 "retrievalDate": "", //prefered timezone?
                 //todo
                 //"urlToEvidenceFile": "39779224-deja-vu-at-well -club.pdf",
                 //"urlToHtmlFile": "39779224-deja-vu-at-welly-club.html",
                 "sourceDataLocalization": "nl" //should be always nl?
             },
             //
             "websiteUrls": [],
             "phoneNumbers": [], //not found
             "emailAddresses": [],
             "category": "dance_club", //not found
             
             //todo validation needed
             "tags": [
                 "entertainment"
             ],
             //
 
             "address": {
                 "countryCode": "nl", //should be always nl?
                 "country": "",
                 "street": "",
                 "houseNumber": "",
                 "postalCode": "",
                 "city": "",
                 "state": "saxony", //not found
                 "region": "sächsische schweiz", //not found
                 "rawAddress": ""
             }
         }*/
    ],


    "artists": [
        {
            "sourceInformation": {
                "uuid": "",
                "sourceId": "",
                "sourceUrl": "https://www.songkick.com/concerts/39779224-deja-vu-at-welly-club",
                "plattform": "www.songkick.com",
                "retrievalDate": "2022-07-22T09:09:53.287Z",
                "urlToEvidenceFile": "39779224-deja-vu-at-well -club.pdf",
                "urlToHtmlFile": "39779224-deja-vu-at-welly-club.html",
                "sourceDataLocalization": "en"
            },
            "websiteUrls": [
                "goolge.places/asdf",
                "www.club.de"
            ],
            "phoneNumbers": [
                "+42 1912992",
                "+42 1912444"
            ],
            "emailAddresses": [
                "asdf@gmail.com",
                "dasdssdsa@web.de"
            ],
            "name": "Bruce Springsteen",
            "category": "live musician",
            "tags": [
                "entertainment"
            ],
            "address": {
                "countryCode": "de",
                "country": "Germany",
                "street": "BEVERLEY ROAD",
                "houseNumber": "42a",
                "postalCode": "HU3 1TS",
                "city": "Hull",
                "state": "saxony",
                "region": "sächsische schweiz",
                "rawAddress": "BEVERLEY ROAD 42a sächsische schweiz saxony Germany"
            }
        },
        {
            "sourceInformation": {
                "uuid": "",
                "sourceId": "",
                "sourceUrl": "https://www.songkick.com/concerts/39779224-deja-vu-at-welly-club",
                "plattform": "www.songkick.com",
                "retrievalDate": "2022-07-22T09:09:53.287Z",
                "urlToEvidenceFile": "39779224-deja-vu-at-well -club.pdf",
                "urlToHtmlFile": "39779224-deja-vu-at-welly-club.html",
                "sourceDataLocalization": "en"
            },
            "websiteUrls": [
                "goolge.places/asdf",
                "www.club.de"
            ],
            "phoneNumbers": [
                "+42 1912992",
                "+42 1912444"
            ],
            "emailAddresses": [
                "asdf@gmail.com",
                "dasdssdsa@web.de"
            ],
            "name": "Bruce Springsteen",
            "category": "live musician",
            "tags": [
                "entertainment"
            ],

            "address": {
                "countryCode": "de",
                "country": "Germany",
                "street": "BEVERLEY ROAD",
                "houseNumber": "42a",
                "postalCode": "HU3 1TS",
                "city": "Hull",
                "state": "saxony",
                "region": "sächsische schweiz",
                "rawAddress": "BEVERLEY ROAD 42a sächsische schweiz saxony Germany"
            }
        }
    ]
}


