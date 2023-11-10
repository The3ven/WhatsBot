//jshint esversion:8
const axios = require("axios");
const fs = require("fs");
const path = require("path");

async function search(query) {
  try {
    const response =
      // await axios.get(`https://jiosaavn-api.vercel.app/search?query=${query}`)
      (await axios.get(`https://saavn.me/search/songs?query=${query}`)).data;

    // console.log(response);

    if (response.status === "FAILED") {
      throw "not-found";
    } else {
      let content = `*Results for* _'${query}'_\n\n`;
      let songarray = [];
      // console.log("response : \n\n\n", JSON.stringify(response),"\n\n\n");
      for (let i = 0; i < response.data.results.length; i++) {
        content += `*${i + 1}.* ${response.data.results[i].name} - ${
          response.data.results[i].primaryArtists
        }\n`;
        songarray.push({ key: i + 1, id: response.data.results[i].id });
      }
      // console.log(JSON.stringify(songarray));
      content += `\nReply this message with \`\`\`!dldsong [number]\`\`\` to download !\n*Ex.* !dldsong 1`;
      return { status: true, content, songarray };
    }
  } catch (error) {
    return {
      status: false,
      content:
        `🙇‍♂️ *Error*\n\n` +
        "```Result not found for " +
        query +
        ", Please try again with different keyword!```",
      songarray: [],
    };
  }
}

async function download(songkey, id) {
  let pretifiedsongkey = Number(songkey.trim());
  try {
    let saveddata = JSON.parse(
      fs.readFileSync(path.join(__dirname, `../cache/song~${id}.json`), "utf8")
    );
    let song = saveddata.find((d) => d.key === pretifiedsongkey);
    // console.log("\n\n\nsong : ", JSON.stringify(song), "\n\n\n");
    if (song) {
      try {
        let data = (await axios.get(`https://saavn.me/songs?id=${song.id}`))
          .data;
        // console.log("\n\n\ndata : ", JSON.stringify(data), "\n\n\n");
        // console.log(
        // "\n\n\nSong : ",
        // data.data[0].image[data.data[0].image.length - 1]
        // );
        return {
          status: true,
          content: {
            text:
              `🎶 *${data.data[0].name}* _(${data.data[0].year})_\n\n📀 *Artist :*  ` +
              "```" +
              data.data[0].primaryArtists +
              "```\n📚 *Album :*  " +
              "```" +
              data.data[0].album.name +
              "```" +
              `\n\n*Download Url* 👇\n${
                data.data[0].downloadUrl[data.data[0].downloadUrl.length - 1]
                  .link
              }`,
            image: await image(
              data.data[0].image[data.data[0].image.length - 1].link
            ),
            songdata: [
              data.data[0].downloadUrl[data.data[0].downloadUrl.length - 1]
                .link,
              data.data[0].name,
            ],
          },
        };
      } catch (w) {
        return {
          status: false,
          content:
            `🙇‍♂️ *Error*\n\n` +
            "```Something went wrong while fetching this song.```",
        };
      }
    } else {
      return {
        status: false,
        content:
          `🙇‍♂️ *Error*\n\n` +
          "```This song key is invalid please send the correct song key.\nEx. !dldsong 1```",
      };
    }
  } catch (error) {
    // console.log(error);
    return {
      status: false,
      content:
        `🙇‍♂️ *Error*\n\n` + "```Cache not found please search the song again```",
    };
  }
}

async function image(link) {
  try {
    let respoimage = await axios.get(link, { responseType: "arraybuffer" });

    return {
      mimetype: "image/jpeg",
      data: Buffer.from(respoimage.data).toString("base64"),
      filename: "jiosaavn",
    };
  } catch (error) {
    // console.log(error);
    return {
      mimetype: "image/jpeg",
      data: "",
      filename: "jiosaavn",
    };
  }
}

module.exports = {
  search,
  download,
};
