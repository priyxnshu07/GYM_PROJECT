package src;

import org.testng.Assert;
import org.testng.annotations.Test;
import java.net.HttpURLConnection;
import java.net.URL;

public class GymTest {

    @Test
    public void verifyServerIsUp() throws Exception {
        System.out.println("Testing connection to http://127.0.0.1:3005...");
        URL url = new URL("http://127.0.0.1:3005");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");
        connection.connect();

        int responseCode = connection.getResponseCode();
        System.out.println("Server responded with code: " + responseCode);
        
        Assert.assertEquals(responseCode, 200, "Server should respond with 200 OK");
    }

    @Test
    public void verifyHomePageContent() throws Exception {
        URL url = new URL("http://127.0.0.1:3005");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");
        
        java.io.BufferedReader in = new java.io.BufferedReader(new java.io.InputStreamReader(connection.getInputStream()));
        String inputLine;
        StringBuilder content = new StringBuilder();
        while ((inputLine = in.readLine()) != null) {
            content.append(inputLine);
        }
        in.close();

        String pageContent = content.toString();
        Assert.assertTrue(pageContent.contains("<!DOCTYPE html>"), "Page should contain HTML doctype");
        System.out.println("Home page content verified.");
    }
}
