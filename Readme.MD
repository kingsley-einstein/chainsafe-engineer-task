**Installing the CLI:**


* Build:

```sh
yarn build
```


* Link:


```sh
npm link
```


**Using the CLI:**


The CLI is available using the `registry-cli` command. Only 2 commands are exposed: `store` and `read`. `store` saves an item in the registry, while `read` obtains all `CIDStored` event data using an address as indexer.


*Using the `store` command:*

The following flags are to be used with this command

| Flag          |   Description                    |
|---------------|----------------------------------|
|-s, --secretKey|Private key to sign transaction   |
|-p, --path     |Directory containing file to store|
|-n, --name     |File name alongside extension     |


Example:

```sh
registry-cli store -s xxxxxxxxxxx -p /home/users -n image.png
```


*Using the `read` command:*

The following flag is to be used with this command

| Flag   | Description              |
|--------|--------------------------|
|-b, --by|Address used in filtering |


Example:

```sh
registry-cli read -b xxxxxxxxxx
```