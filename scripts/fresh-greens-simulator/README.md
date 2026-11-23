# Local Fresh Greens simulator

The case study can display a running iOS app on the same Mac. The browser forwards taps, drags, and typed search queries to Fresh Greens on a dedicated simulator. Map tiles, search results, and routes come from the installed app and its providers.

1. In Xcode, boot one iPhone 15 Pro Max simulator named `Fresh-Greens-Portfolio`. Install the Fresh Greens simulator build on that device. Set its simulated location to Brooklyn and allow location while using Fresh Greens. The development app needs its Metro server. The visitor Release carries its own JavaScript bundle.
2. From the portfolio checkout, start the bridge in a separate terminal. For the visitor Release, run `node scripts/fresh-greens-simulator/serve.mjs --visitor`. For the development build, run `node scripts/fresh-greens-simulator/serve.mjs`.
3. Open the [route screen in the opening chapter](http://127.0.0.1:4391/work/fresh-greens#fg-app-walkthrough) and select **Open the iOS app**. Select its search field, type a destination, pick a result, and use **Go**. Control-C in the bridge terminal stops the browser connection.

The bridge listens on `127.0.0.1:4397` and accepts frames embedded by the local portfolio on ports 4391 and 4396. Its [health check](http://127.0.0.1:4397/health) reports readiness after XCTest connects. The runner accepts either the installed visitor app (`com.freshgreens.portfolio`) or the development app (`com.freshgreens.navigation`). It uses the dedicated simulator's current app session. Public visitors need a hosted simulator with a separate session per visitor.
