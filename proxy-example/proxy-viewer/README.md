# Getting Started with the iTwin Viewer Create React App Template

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Two changes have been implemented:

1. The auth was simplified with `MyAuthClient`. This just returns a dummy access token. It should be replaced with a layer of Auth from your application.
1. The `<Viewer>` component has been configured to communicate with the proxy server. The `backendConfiguration` and `hubAccess` props, specifically.

Other than that, it's the same as iTwin Viewer CRA template.

## Environment Variables

You should also add a valid iTwinId and iModelId for your user in the .env file:

```bash
# ---- Test ids ----
IMJS_ITWIN_ID = ""
IMJS_IMODEL_ID = ""
```

- For the IMJS_ITWIN_ID variable, you can use the id of one of your existing iTwins. You can obtain their ids via the [iTwin REST APIs](https://developer.bentley.com/apis/itwins/operations/get-itwin/).

- For the IMJS_IMODEL_ID variable, use the id of an iModel that belongs to the iTwin that you specified in the IMJS_ITWIN_ID variable. You can obtain iModel ids via the [iModel REST APIs](https://developer.bentley.com/apis/imodels-v2/operations/get-imodel-details/).

- Alternatively, you can [generate a test iModel](https://developer.bentley.com/tutorials/web-application-quick-start/#4-create-an-imodel) to get started without an existing iModel.

- If at any time you wish to change the iModel that you are viewing, you can change the values of the iTwinId or iModelId query parameters in the url (i.e. localhost:3000?iTwinId=myNewITwinId&iModelId=myNewIModelId)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Notes

If you are not using NPM, remove the `USING_NPM` env var from [.env](./.env)

## Next Steps

- [iTwin Viewer options](https://www.npmjs.com/package/@itwin/web-viewer-react)

- [Extending the iTwin Viewer](https://developer.bentley.com/tutorials/itwin-viewer-hello-world/)

- [Using the iTwin Platform](https://developer.bentley.com/)

- [iTwin Developer Program](https://www.youtube.com/playlist?list=PL6YCKeNfXXd_dXq4u9vtSFfsP3OTVcL8N)
