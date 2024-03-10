class ImageModifier
{
    static replaceThumbWith1080p(url: string | undefined): string {
        const modifiedUrl = url ? url.replace("/t_thumb/", "/t_1080p/") : "";
        return modifiedUrl;
    }
    
    static replaceThumbWithScreenshotHuge(url: string | undefined): string {
        const modifiedUrl = url
            ? url.replace("/t_thumb/", "/t_screenshot_huge/")
            : "";
        return modifiedUrl;
    }
}

export default ImageModifier;