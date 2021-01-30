# MIFARE Cracker tools

1. Mifare Classic Offline Cracker

   See https://github.com/nfc-tools/mfoc

2. Mifare Offline Cracking GUI for Windows

   See http://www.huuf.info/OV/

3. MIFARE Classic Universal toolkit

   See https://github.com/nfc-tools/mfcuk

4. Proxmark 3

   See https://github.com/Proxmark/proxmark3

5. Chameleon Mini

   See https://github.com/emsec/ChameleonMini

6. libnfc, mfoc and mfcuk for Windows build tutorial (Chinese ONLY)

   See https://zhuanlan.zhihu.com/p/51379667

   See https://www.jianshu.com/p/c02b7f7a7cfa

# MIFARE Classic Card Types

1. Standard MIFARE Classic Card

   - 0 Block is NOT WRIABLE.
   - UID is randomly by the manufacturer.
   - Product page: https://www.mifare.net/en/products/chip-card-ics/mifare-classic/
   - Product page: https://nxp.com/pages/:NTAG-TAGS-AND-LABELS
   - Product page: https://nxp.com/pages/:MF1S50YYX_V1
   - Product page: https://nxp.com/pages/:MF1S70YYX_V1

2. UID Card

   - All blocks writeable with magic command.
   - Magic commands can bypass authentication.
   - See https://stackoverflow.com/a/42299452

3. CUID Card

   - The UID card magic command is not processed.
   - Based standard commands write 0 block.

4. FUID Card

   - The UID card magic command is not processed.
   - Based standard commands write 0 block with write once.

5. UFUID Card

   - Based on UID Card.
   - After the locked card, the behavior is consistent with Standard MIFARE Classic Card.
   - The lock card is a magic command.
   - See http://www.proxmark.org/forum/viewtopic.php?pid=32307

6. SUID Card

   - Based on CUID Card.
   - After the locked card, the behavior is consistent with Standard MIFARE Classic Card.
   - The lock card is a magic command.

7. KUID Card

   - The UID card magic command is not processed.
   - Based non-standard commands write card.

# Card Reader

1. ACR122U USB NFC Reader

   - Based PN532 solution
   - Product page: https://www.acs.com.hk/en/products/3/acr122u-usb-nfc-reader/

2. MFRC522: Standard performance MIFARE® and NTAG® frontend

   - Product page: https://www.nxp.com/pages/:MFRC52202HN1

3. PN532: NFC integrated solution

   - Product page: https://www.nxp.com/pages/:PN5321A3HN

4. PN5180: High-performance multi-protocol full NFC Forum-compliant frontend

   - Product page: https://www.nxp.com/pages/:PN5180
