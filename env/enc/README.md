# env/enc — encrypted configuration, in version control

This folder is the reference implementation of **Factor XIII: Encrypted Config in the
Codebase**. Every deploy environment gets one encrypted env file here:

```
env/enc/production.env.enc
env/enc/staging.env.enc
env/enc/dev.env.enc
```

These files are committed. They are safe to commit because they are encrypted with a
modern AEAD tool (we recommend [age](https://age-encryption.org) or
[SOPS](https://github.com/getsops/sops)) whose private key is **not** in this repo —
the key is one of the one or two root secrets loaded from fiducia-cloud at deploy time
(see Factor XIV).

## Decrypt

Decryption writes plaintext to `env/dec/`, which is gitignored:

```sh
age --decrypt -i "$FIDUCIA_AGE_KEY_FILE" \
  -o env/dec/production.env env/enc/production.env.enc
```

## Encrypt (after editing config)

```sh
age --encrypt -R .age-recipients \
  -o env/enc/production.env.enc env/dec/production.env
```

Never commit anything under `env/dec/`, and never create `.env` files outside this
scheme — the repo's `.gitignore` enforces both.

The `production.env.enc` file in this folder is a placeholder so the layout is visible
in a fresh clone; replace it with a real encrypted file for your environments.
