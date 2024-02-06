// import fetch from "node-fetch";
import * as config from "config";

export async function getResultFileByMetadata(
  metaDataId: string
): Promise<string> {
  const url =
    config.get<string>("mesRestApi.dcToolsEndpoint") +
    `genResultFileByBloborMDIDorSNID.php?mdid=${metaDataId}&blobName=TestLog`;
  // const url = `https://api.gentex.com/gtm/dctools/v1/genResultFileByBloborMDIDorSNID.php?mdid=${metaDataId}&blobName=TestLog`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "text/xml",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    },
  });

  const result = await response.text();

  return result ? (result as string) : "";
}

export async function getFailedTagsByMetadata(
  metaDataId: string
): Promise<string[]> {
  const resultFile = await getResultFileByMetadata(metaDataId);
  if (resultFile && resultFile.length > 0) {
    const filteredResults = resultFile
      .split(/[\t\n]+/)
      .filter((x) => x.startsWith("*"));
    const tags = filteredResults.map((x) => x.trim().replace("*", ""));
    return tags;
  }
  return [];
}
