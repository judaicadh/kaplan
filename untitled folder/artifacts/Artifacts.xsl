<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="dsc/collection">
        <html>
            <body>
                <table border="1">
                    <tr>
                        <th>Genre</th>
                        <th>Genre Sublevel</th>
                        <th>Description 1</th>
                        <th>Person Name 1</th>
                        <th>Person Name 2</th>
                        <th>Corporation Name</th>
                        <th>Location</th>
                        <th>Date</th>
                        <th>Container 1 Type</th>
                        <th>Container 1 Label</th>
                        <th>Container 1 Locator</th>
                        <th>Container 2 Type</th>
                        <th>Container 2 Locator</th>
                        <th>Tiff Locators</th>
                        
                        
                        
                    </tr>
                    <xsl:for-each select="c02/c03">
                        <tr>
                            <td><xsl:value-of select="../../did/unittitle"/></td>
                            <td><xsl:value-of select="../did/unittitle"/></td>
                            <td><xsl:value-of select="did/unittitle"/></td>
                            <td><xsl:value-of select="did/unittitle/persname[1]"/></td>
                            <td><xsl:value-of select="did/unittitle/persname[2]"/></td>
                            <td><xsl:value-of select="did/unittitle/corpname"/></td>
                            <td><xsl:value-of select="did/unittitle/geogname"/></td>
                            <td><xsl:value-of select="did/unitdate"/></td>
                            
                            <td><xsl:value-of select="did/container[1]/@type"/></td>
                            <td><xsl:value-of select="did/container/@label"/></td>
                            <td><xsl:value-of select="did/container[1]"/></td>
                            <td><xsl:value-of select="did/container[2]/@type"/></td>
                            <td><xsl:value-of select="did/container[2]"/></td>
                            <td><xsl:value-of select="scopecontent/p[1]"/></td>
                            
                            
                            
                            
                        </tr>
                    </xsl:for-each>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet> 