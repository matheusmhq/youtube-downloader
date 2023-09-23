const ytdl = require("ytdl-core");
const fs = require("fs");

const youtubeUrls = require("./youtubeUrls");

const pathDownload = "./download";
const pathVideos = `${pathDownload}/videos`;
const pathAudios = `${pathDownload}/audios`;

const isAudio = false;
const path = isAudio ? pathAudios : pathVideos;
const extension = isAudio ? "mp3" : "mp4";
const type = isAudio ? "audio" : "audioandvideo";

function createFolder(nameFolder) {
  fs.mkdir(`${nameFolder}`, (error) => {});
}

function dateCurrentFormat() {
  return new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour12: false,
  }).format(new Date());
}

async function downloadVideos() {
  createFolder(pathDownload);
  createFolder(pathVideos);
  createFolder(pathAudios);

  console.log(`\n======== Start download videos ========\n`);

  try {
    for await (const youtubeUrl of youtubeUrls) {
      const info = await ytdl.getInfo(youtubeUrl, {});
      const titleVideo = info.videoDetails.title;
      const dateCurrentValue = dateCurrentFormat().replaceAll("/", "-");

      console.log(`========> video "${titleVideo}"`);

      createFolder(`${path}/${dateCurrentValue}`);

      ytdl(youtubeUrl, {
        filter: type,
        quality: "highest",
      }).pipe(
        fs.createWriteStream(
          `${path}/${dateCurrentValue}/${titleVideo}.${extension}`
        )
      );
    }
  } catch (error) {
    console.log(`\n======== Download error ${error}`);
  } finally {
    console.log("\n======== End download videos ========\n");
  }
}

downloadVideos();
