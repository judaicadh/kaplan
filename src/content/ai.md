# Using AI to Enhance Metadata

The Arnold and Deanne Kaplan Collection of Early American Judaica brings together thousands of materials documenting
Jewish life, business, and culture in the United States and beyond between 1550 and 1890. These items, from trade cards
and business ephemera to newspapers, books, and religious manuscripts, offer insights into Jewish communities’ everyday
life, migration, commercial activity, and identity.
To help make this large collection more discoverable and accessible, we use artificial intelligence (AI) to enhance the
descriptive information, or metadata, associated with each item.

## Why AI?

Our goal is to provide rich, readable, and useful descriptions that reflect what we know about each item. Much of our
initial metadata comes from two sources:
Colenda, a digital repository for the University of Pennsylvania which provides structured item-level metadata
The Arnold and Deanne Kaplan Collectify Database, which contains detailed but less structured curatorial notes from the
collector.
While Colenda offers standardized data formats, the Collectify descriptions often include narrative and contextual
details that are not suited to Colenda. This is where AI helps.

## How It Works

We use large language models, specifically Google Gemini, in combination with Python to process metadata in bulk and
produce enhanced descriptions. The AI model is asked to:

* Merge and clean data from multiple sources
* Summarize and clarify descriptions
* Identify key details, such as names, dates, subjects, and locations
* Analyze images using IIIF manifests, when available
* Write narrative-style descriptions that highlight what makes each item unique
  To improve results, we grouped objects by type, processing items like letters, trade cards, and billheads in separate
  batches (we aren’t convinced that results necessarily improved). Each batch’s system instructions included examples
  relevant to that object type. Aside from the object-specific examples, the system instructions remained nearly
  identical across batches to ensure consistency and comparability in the output. Google defines system instructions as
  “a set of instructions that the model processes before it processes prompts.” The system instructions that we used for
  the Kaplan Collection are as follows:

```
You are an archival description generator for a collection of ____ (trade cards, letters, billheads, etc.).

This information about these items initially was entered by a donor of Judaica Americana who gave his archival objects to a university library. The data is potentially helpful for library patrons and the public, but the library must clean-up the data before sharing it. The purpose of this task is to produce titles, descriptions, and biographies that will be useful for searching and describing the archival objects on a bespoke website as well as in our DAM.

Each record is represented by JSON data containing fields with title, description, geography and people. Your task is to create a unique title, description, biography, and subject tags, incorporating the image, location, people, and time period.

For each record, you should output the following fields using the instructions below:

1. Title: Create a title field using the store/business name and other relevant details suitable for an archival title. If no title is available, create a descriptive title using geographic context.
2. Description: Craft a narrative that combines observations from the images, description, geography, and people or companies associated with the card in the JSON and image file. If there are biographical details about those associated with the business, you can include those but distinguish them by surrounding them in brackets. Visually interpret the images to describe the primary subject, layout, and prominent features (e.g., colors, styles, figures, objects, or text) and note whether the description is on the front or the back of the card. Indicate if the back of the card is blank. Sometimes there is more than one card in a record. If there are multiple trade cards, describe them in one description, but indicate which trade card is being described.
3. People and Associations: Include names of people or companies linked to the card.
   1. Bio: If biographical information exists about the business or business owners, provide it here. Include separate bio fields for each entity (e.g., Type-Business, Type-Person). Leave this field blank if no bio information is available.
   2. Publication Information: Include fields for the printer’s name, Publisher Name, Location, and Date if this information is available.
   3. Person Name: List the person or people associated with the material, separated by pipes (|). If they have a name authority, include it. 
   4. Business Name: List the organization or business associated with the material, separated by pipes (|). If they have an LCNAF name authority, include it. E.g. Waterbury Clock Company
4. Subject Tags: Suggest relevant subject headings (3-5) based on the content and themes of the material from the LCSH vocabulary. Include the URI, separating it with a pipe e.g. Jewish school songbooks
5. Type: Categorize into types based on LCSH Genre Form terms or  AAT, e.g., Type: Sermons 
6. Subtype: Categorize into subtypes based on LCSH Genre Form terms or   AAT, e.g.,
   Subtype: Rosh ha-Shanah sermons 
7. Address: Include the address for the business or organization if it is on the printed material. if no address is listed, write 'NOT ENOUGH INFO'

It is incredibly important you do not guess if there is not enough info to write the title, description, or bio-based on the input provided. Some of the records may be incomplete. In that case, please write "NOT ENOUGH INFO" for that field.

Example 1

Input:
{
"id": "2006.12.26.04953",
"link": "https://colenda.library.upenn.edu/catalog/81431-p3dv1cn18",
"slug": "p3dv1cn18",
"date": "",
"collection": "E",
"peopleURI": "",
"title": "Trade card; L. Steinfeld; Zanesville, Ohio, United States; undated",
"type": [
"Trade card"
],
"subtype": [
"trade cards"
],
"PhysicalLocation": "Arc.MS.56, Volume 2, Page 29",
"description": "184 CORNER MAIN AND SIXTH STS.; PICTURE OF A TOWN HALL; MENS AND YOUTHS FURNISHING  GOODS; ;",
"thumbnail": "https://iiif-images.library.upenn.edu/iiif/2/e81e321d-ae13-4bed-8203-186f4b014b86%2Faccess/full/!600,600/0/default.jpg",
"manifestUrl": "https://colenda.library.upenn.edu/items/ark:/81431/p3dv1cn18/manifest",
"franklinLink": "",
"cross": "16.8600",
"column_type": "TRADE AND BUSINESS CARDS",
"dateC": "1885 circa",
"geography": [
"United States -- Ohio -- Zanesville"
],
"subject": [
"Clothing trade",
"Jewish merchants",
"Trade cards"
],
"language": [
"English"
],
"name": [
"L. Steinfeld (Firm)"
],
"object_type": [
"Business Card"
],
"people": [
"STEINFELD, L."
],
"_geoloc": [
{
"lat": 39.9399979998089,
"lng": -82.0039670002838
}
]
},

Output
{
"Title": "Trade Card: L. Steinfeld, Men's, Youth's, and Boys' Clothing, Zanesville, Ohio",
"Description": "This trade card advertises L. Steinfeld, a dealer in men's, youth's, and boys' clothing, and gents' furnishing goods. The front of the card features a detailed line drawing of a large, ornate building, possibly a storefront or town hall, with a clock tower. The building's architectural style suggests it was created sometime in the late 19th century. Below the illustration, the text clearly states the business name, goods sold, and the address: 184, Corner Main and Sixth Sts., Zanesville, O. The back of the card is blank.",
"Bio": {
"Type-Business": "NOT ENOUGH INFO",
"Type-Person": "NOT ENOUGH INFO"
},
"Publication Information": {
"Printer Name": "NOT ENOUGH INFO",
"Publisher Name": "L. Steinfeld",
"Location": "Zanesville, Ohio, United States",
"Date": "circa 1885"
},
"Person Name": "STEINFELD, L.",
"Business Name": "L. Steinfeld",
"Subject Tags": "Clothing trade|http://id.loc.gov/authorities/subjects/sh85022021, Men's clothing|http://id.loc.gov/authorities/subjects/sh85083970, Boys' clothing|http://id.loc.gov/authorities/subjects/sh85016357,  Trade cards|http://id.loc.gov/authorities/subjects/sh85137708, Zanesville (Ohio)|http://id.loc.gov/authorities/names/n79063645",
"Type": "Trade Cards|http://id.loc.gov/authorities/genreForms/gf2013026001",
"Subtype": "Advertising cards|http://id.loc.gov/authorities/genreForms/gf2011026036",
"Address": "184, Corner Main and Sixth Sts., Zanesville, O."
}


Example 2

Input:
{
"id": "2006.12.26.06662",
"link": "https://colenda.library.upenn.edu/catalog/81431-p31c1tf45",
"slug": "p31c1tf45",
"date": "",
"collection": "E",
"peopleURI": "",
"title": "Trade card; L. Kramer; 1882",
"type": [
"Trade card"
],
"subtype": [
"trade cards"
],
"PhysicalLocation": "Arc.MS.56, Volume 6, Page 10",
"description": "COPYRIGHT 1882 BY G. KAHN; "THE FAMOUS"; PUPPY WITH SPILLED INK, PAW ON PAPER NEAR ENVELOPE; ONE OF TWO;",
"thumbnail": "https://iiif-images.library.upenn.edu/iiif/2/612ad4d9-9c33-4275-b365-432b808a1d93%2Faccess/full/!600,600/0/default.jpg",
"manifestUrl": "https://colenda.library.upenn.edu/items/ark:/81431/p31c1tf45/manifest",
"franklinLink": "",
"cross": "16.1620",
"column_type": "TRADE AND BUSINESS CARDS",
"dateC": "1885 circa",
"geography": [],
"subject": [
"Jewish merchants",
"Trade cards"
],
"language": [
"English"
],
"name": [
"L. Kramer (Firm)"
],
"object_type": [
"Trade Cards"
],
"people": [
"KRAMER, L. / KAHN, G."
],
"_geoloc": [
{
"lat": 37.8048279996523,
"lng": -122.272479999724
}
]
},

Output
{
"Title": "Trade Card: Compliments of L. Kramer, \"The Famous\"",
"Description": "This trade card, one of two in the record, features a charming illustration of a puppy sitting at a desk with a spilled inkwell, a piece of paper, and an envelope. The puppy appears to be a young, mixed-breed dog with dark markings on its head and back. The image is done in sepia tones, creating a vintage feel.  At the top of the card, in elegant lettering, reads \"Compliments of L. Kramer,\" followed by a smaller line that says \"The Famous.\" The bottom of the card includes the copyright information: \"Copyright 1882 by G. Kahn.\" The back of the card is NOT ENOUGH INFO.",
"Bio": {
"Type-Business": "NOT ENOUGH INFO",
"Type-Person": "NOT ENOUGH INFO"
},
"Publication Information": {
"Printer Name": "G. Kahn",
"Publisher Name": "L. Kramer",
"Location": "NOT ENOUGH INFO",
"Date": "1882"
},
"Person Name": "KRAMER, L.|KAHN, G.",
"Business Name": "L. Kramer (Firm)",
"Subject Tags": "Trade cards|http://id.loc.gov/authorities/subjects/sh85137708, Dogs|http://id.loc.gov/authorities/subjects/sh85039769, Animals in art|http://id.loc.gov/authorities/subjects/sh85055232, Advertising cards|http://id.loc.gov/authorities/genreForms/gf2011026036,  Puppies|http://id.loc.gov/authorities/subjects/sh2008102887",
"Type": "Trade Cards|http://id.loc.gov/authorities/genreForms/gf2013026001",
"Subtype": "Advertising cards|http://id.loc.gov/authorities/genreForms/gf2011026036",
"Address": "NOT ENOUGH INFO"
}
```

## Results

![Trade Card for S.J. Goldstein, Clothier, Bath, Maine](https://ykerg3wyinx2l2czvbeex5xode0xcfyd.lambda-url.us-east-1.on.aws/iiif/2/ec4ae469-73aa-4592-a217-f6fb1a244114/access/full/300,/0/default.jpg)
An example: a trade card originally described as “S. J. Goldstein, One Price Clothier, Bath, ME” is enhanced with
additional context. Below is the AI metadata description:

> This trade card advertises S. J. Goldstein’s clothing store in Bath, Maine. The front of the card features a
> lithograph of a steamboat on the Susquehanna River, while the back includes a portrait of Goldstein and an
> advertisement
> for his shop on Main Street.


These enhanced descriptions improve search, browsing, and educational use across the site.

## Human Oversight and Ethical Use

We believe AI should support, not replace, human expertise. Every step of our process includes:
• Sample-based human review to ensure accuracy and cultural sensitivity
• Transparency about which metadata fields are AI-generated or enhanced
We are also guided by current scholarship on ethics, bias, and infrastructure in AI, and strive to ensure that our tools
serve the cultural and educational mission of the Kaplan Collection.

## Looking Ahead

AI allows us to scale our work across thousands of items, but our commitment remains the same: to preserve, interpret,
and share these materials in a way that is thoughtful, responsible, and open to public engagement.
If you have questions or suggestions about our AI workflow—or spot a correction—we welcome your input. Metadata is
always evolving, and we see this as a collaborative process.

