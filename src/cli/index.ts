#!/usr/bin/env node
import yargs from "yargs";
import { logAllStoredEvents, pinAndStore } from "./store";

yargs
  .command(
    "store",
    "Save file in registry",
    (yargs) => {
      return yargs
        .option("secretKey", {
          type: "string",
        })
        .option("path", {
          type: "string",
        })
        .option("name", {
          type: "string",
        });
    },
    (args) => {
      pinAndStore(<string>args.secretKey, {
        location: <string>args.path,
        name: <string>args.name,
      }).then(() => {
        console.log("Completed");
      });
    }
  )
  .command(
    "read [by]",
    "Get all stored events triggered by address",
    (yargs) => {
      return yargs.option("by", {
        type: "string",
      });
    },
    (args) => {
      logAllStoredEvents(<string>args.by).then(() => {
        console.log("Done!");
      });
    }
  )
  .describe("b", "Address to filter events")
  .alias("by", "b")
  .describe("s", "Private key to sign transaction")
  .alias("secretKey", "s")
  .describe("p", "The directory that houses the file")
  .alias("path", "p")
  .describe("n", "File name with extension")
  .alias("name", "n").argv;
