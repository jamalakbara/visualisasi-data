const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const fileUpload = require("express-fileupload");
const path = require("path");
const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(fileUpload());

app.use("/public", express.static(path.join(__dirname, "static")));

port = 1234;

app.post("/vis", (req, res) => {
  if (!req.files) {
    res.redirect("/");
  } else {
    const dataset = req.files.dataset;

    dataset.mv("./static/data/dataset.json", (e) => {
      if (e) {
        res.redirect("/");
      } else {
        try {
          if (fs.existsSync("./static/data/dataset.json")) {
            fs.readFile("static/data/dataset.json", (e, data) => {
              if (e) throw e;
              let json_chat = JSON.parse(data);
              // console.log(json_chat[0].messages);
              let json_data_chat_for_chart = [];
              json_chat.forEach((el) => {
                // let data_timestamp_val = [];
                // let start, end;
                // el.messages.forEach((mesg) => {
                //   data_timestamp_val.push({
                //     label: mesg.id,
                //     data: [
                //       {
                //         timeRange: [mesg, end],
                //         val: mesg.text,
                //       },
                //     ],
                //   });
                // });
                messages_val = el.messages;
                json_data_chat_for_chart.push({
                  group: el.contactName,
                  data: [
                    {
                      label: null,
                      data: [
                        {
                          timeRange: [
                            el.messages[0].timestamp,
                            el.messages[el.messages.length - 1].timestamp,
                          ],
                          val: messages_val.map((m, i) => {
                            if (i <= 3) {
                              return JSON.stringify(m.text);
                            }
                          }),
                          realVal: [...messages_val],
                        },
                      ],
                    },
                  ],
                });
              });
              // console.log(json_data_chat_for_chart);
              // let cek = new Date("2020-01-30T04:03:21Z").getTime() - 3600;
              // console.log(new Date(cek), new Date("2020-01-30T04:03:21Z"));
              res.render("visualisasi", {
                data: json_data_chat_for_chart,
              });
            });
          }
        } catch (error) {
          res.redirect("/");
        }
      }
    });
  }
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/result", (req, res) => {
  try {
    if (fs.existsSync("./static/data/dataset.json")) {
      fs.readFile("static/data/dataset.json", (e, data) => {
        let json_chat = JSON.parse(data);
        let groups = [];
        let items = [];
        json_chat.forEach((jc, i) => {
          // bikin grup atau disebut juga nama kontak yang di json nya
          groups.push({
            id: i,
            content: jc.subject ? jc.subject : jc.contactName,
          });

          // bikin item buat isian grupnya
          // jc.messages.forEach((msg) => {
          //   items.push({
          //     id: msg.id,
          //     group: i,
          //     content: msg.fromMe
          //       ? `${msg.text} <span style="color:#97B0F8;">(Saya)</span>`
          //       : `${msg.text} <span style="color:#97B0F8;">(${
          //           msg.remoteResourceDisplayName
          //             ? msg.remoteResourceDisplayName
          //             : jc.contactName
          //         })</span>`,
          //     start: new Date(msg.timestamp),
          //     type: "box",
          //   });
          // });
          items.push({
            id: `blgndr${i}`,
            content: JSON.stringify(jc.messages),
            group: i,
            start: new Date(jc.messages[0].timestamp),
            end: new Date(jc.messages[jc.messages.length - 1].timestamp),
          });
        });
        res.render("result", {
          groups: groups,
          items: items,
        });
      });
    }
  } catch (error) {
    res.redirect("/");
  }
  // res.render("result");
});

app.listen(port, () => console.log(`Server jalan di http://127.0.0.1:${port}`));
