package com.dapperdude404.swaadfolio;
import java.net.URI;
final class NavigationPolicy {
    static boolean isLocal(String url) {
        try {
            URI uri = URI.create(url);
            return "https".equals(uri.getScheme()) && "appassets.androidplatform.net".equals(uri.getHost())
                && uri.normalize().getPath().equals(uri.getPath()) && uri.getPort() == -1 && uri.getRawUserInfo() == null && uri.getPath().startsWith("/assets/www/");
        } catch (RuntimeException e) { return false; }
    }
    static boolean isExternal(String url) {
        try { URI uri = URI.create(url); return "https".equals(uri.getScheme()) && uri.getHost() != null && uri.getRawUserInfo() == null; }
        catch (RuntimeException e) { return false; }
    }
}
