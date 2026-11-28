package com.dapperdude404.swaadfolio;
import org.junit.Test;
import static org.junit.Assert.*;
public class NavigationPolicyTest {
    @Test public void acceptsBundledRoutes() { assertTrue(NavigationPolicy.isLocal("https://appassets.androidplatform.net/assets/www/index.html#recipe/besan-chilla")); }
    @Test public void rejectsUntrustedOriginsAndSchemes() {
        for (String url : new String[]{"https://appassets.androidplatform.net/assets/www/../secret", "file:///etc/passwd", "javascript:alert(1)", "https://evil.test/assets/www/index.html", "https://appassets.androidplatform.net.evil.test/assets/www/index.html", "https://user@appassets.androidplatform.net/assets/www/index.html", "https://appassets.androidplatform.net:444/assets/www/index.html"}) assertFalse(url, NavigationPolicy.isLocal(url));
    }
    @Test public void externalLinksMustBeHttps() { assertTrue(NavigationPolicy.isExternal("https://commons.wikimedia.org/")); assertFalse(NavigationPolicy.isExternal("intent://settings")); assertFalse(NavigationPolicy.isExternal("http://example.com")); }
}
