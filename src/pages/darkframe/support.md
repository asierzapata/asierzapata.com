---
layout: ../../layouts/page-layout.astro
title: Darkframe Studio support
description: Help, requirements and contact for Darkframe Studio, the iPad app for stacking and editing smart telescope captures.
---

# Darkframe Studio support

Darkframe Studio turns the raw frames from your smart telescope into a finished deep-sky image on your iPad. It stacks your captures into a linear FITS master with a JPEG preview, then lets you edit the result and save it as a new FITS copy.

## Get help

Email [asier.zapata@gmail.com](mailto:asier.zapata@gmail.com?subject=Darkframe%20Studio%20support) and I will get back to you. It helps a lot if you include:

- Your iPad model and iPadOS version
- The Darkframe Studio version (and build, if you use TestFlight)
- Your telescope model and firmware version
- What you did, what you expected, and what happened instead, with a screenshot if you can

If you test the beta, you can also send feedback and screenshots from the TestFlight app.

## Requirements

- An iPad with an M1 chip or later
- iPadOS 18 or later
- Captures from a ZWO Seestar S50 or DWARFLAB Dwarf III. Other FITS images may open, but they are not supported yet.

## Common questions

### How do I get my captures onto the iPad?

Copy the capture folder from your telescope into the Files app, on the iPad, in iCloud Drive or on a connected drive. Then tap **Import** in Darkframe Studio, choose **New from captures…** and select the folder or the individual files.

### Will Darkframe Studio change my original files?

No. Stacking writes a new folder with the master FITS and its JPEG preview, and every save from the editor writes a new edited FITS copy. Your captures and earlier saves stay as they are.

### Where are my adjustments saved?

Next to the edited image, in a small file with the same name ending in `.darkframe.json`. Keep it in the same folder as the edited FITS and the original image, and you can reopen the image and keep editing.

### Does it need an internet connection?

No. Stacking, editing and noise reduction all run on your iPad.

### Why were some frames left out of a stack?

Darkframe Studio checks every frame before stacking and leaves out frames it cannot combine safely, such as duplicates, frames from a different target or camera setting, or images that are already stacked. The review screen lists what was left out and why.

### Does Darkframe Studio collect my data?

No. See the [privacy policy](/darkframe/privacy).

Darkframe Studio is an independent app and is not affiliated with ZWO or DWARFLAB.
