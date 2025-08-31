import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import axios from 'axios';

// Test real web scraping functionality
export async function GET() {
  try {
    console.log('Starting real web scraping test...');

    // Test 1: Simple HTTP request to ESPN recruiting page
    const espnTest = await testESPNScraping();

    // Test 2: Simple HTTP request to 247Sports
    const sports247Test = await test247SportsScraping();

    // Test 3: RSS feed parsing
    const rssTest = await testRSSFeedParsing();

    return NextResponse.json({
      success: true,
      message: 'Real web scraping tests completed',
      results: {
        espn: espnTest,
        sports247: sports247Test,
        rss: rssTest,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Scraping test failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: 'Check console for full error details',
      },
      { status: 500 },
    );
  }
}

async function testESPNScraping() {
  try {
    console.log('Testing ESPN scraping...');

    // Use a more generic ESPN sports page that's less likely to be blocked
    const response = await axios.get('https://www.espn.com/college-sports/', {
      timeout: 10000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const $ = cheerio.load(response.data);

    // Extract basic page information
    const title = $('title').text();
    const headlines = $('h2, h3')
      .map((i, el) => $(el).text().trim())
      .get()
      .slice(0, 5);

    return {
      success: true,
      status: response.status,
      title: title,
      headlines: headlines,
      contentLength: response.data.length,
    };
  } catch (error) {
    console.error('ESPN scraping failed:', error.message);
    return {
      success: false,
      error: error.message,
      statusCode: error.response?.status || 'No response',
    };
  }
}

async function test247SportsScraping() {
  try {
    console.log('Testing 247Sports scraping...');

    // Use a public page that's less likely to be blocked
    const response = await axios.get('https://247sports.com/', {
      timeout: 10000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const $ = cheerio.load(response.data);

    // Extract basic page information
    const title = $('title').text();
    const headlines = $('h2, h3, .headline')
      .map((i, el) => $(el).text().trim())
      .get()
      .slice(0, 5);

    return {
      success: true,
      status: response.status,
      title: title,
      headlines: headlines,
      contentLength: response.data.length,
    };
  } catch (error) {
    console.error('247Sports scraping failed:', error.message);
    return {
      success: false,
      error: error.message,
      statusCode: error.response?.status || 'No response',
    };
  }
}

async function testRSSFeedParsing() {
  try {
    console.log('Testing RSS feed parsing...');

    // Test with a sports RSS feed
    const response = await axios.get('https://www.espn.com/espn/rss/news', {
      timeout: 10000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const $ = cheerio.load(response.data, { xmlMode: true });

    // Extract RSS items
    const items = $('item')
      .map((i, el) => ({
        title: $(el).find('title').text(),
        description: $(el).find('description').text(),
        pubDate: $(el).find('pubDate').text(),
        link: $(el).find('link').text(),
      }))
      .get()
      .slice(0, 3);

    return {
      success: true,
      status: response.status,
      itemCount: items.length,
      items: items,
    };
  } catch (error) {
    console.error('RSS feed parsing failed:', error.message);
    return {
      success: false,
      error: error.message,
      statusCode: error.response?.status || 'No response',
    };
  }
}

// Test POST endpoint for live scraping
export async function POST(request: Request) {
  try {
    const { testType, url } = await request.json();

    console.log(`Testing ${testType} scraping for URL: ${url}`);

    if (testType === 'custom') {
      return await testCustomURL(url);
    } else if (testType === 'recruiting') {
      return await testRecruitingData();
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid test type',
      },
      { status: 400 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}

async function testCustomURL(url: string) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const $ = cheerio.load(response.data);

    // Extract basic page structure
    const title = $('title').text();
    const headings = $('h1, h2, h3')
      .map((i, el) => $(el).text().trim())
      .get()
      .slice(0, 10);
    const links = $('a[href]')
      .map((i, el) => $(el).attr('href'))
      .get()
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      url: url,
      title: title,
      headings: headings,
      links: links,
      contentLength: response.data.length,
      status: response.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        url: url,
      },
      { status: 500 },
    );
  }
}

async function testRecruitingData() {
  try {
    // Test scraping recruiting-specific data patterns
    const testResults = [];

    // Test multiple recruiting sites with different approaches
    const sites = [
      { name: 'ESPN College Sports', url: 'https://www.espn.com/college-sports/' },
      { name: 'Sports Reference', url: 'https://www.sports-reference.com/' },
    ];

    for (const site of sites) {
      try {
        const response = await axios.get(site.url, {
          timeout: 8000,
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          },
        });

        const $ = cheerio.load(response.data);

        // Look for recruiting-related content
        const recruitingContent = $(
          '*:contains("recruit"), *:contains("ranking"), *:contains("player")',
        ).length;
        const links = $('a[href*="recruit"], a[href*="player"], a[href*="ranking"]')
          .map((i, el) => $(el).attr('href'))
          .get()
          .slice(0, 5);

        testResults.push({
          site: site.name,
          success: true,
          status: response.status,
          recruitingElements: recruitingContent,
          recruitingLinks: links,
          contentLength: response.data.length,
        });
      } catch (siteError) {
        testResults.push({
          site: site.name,
          success: false,
          error: siteError.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Recruiting data scraping tests completed',
      results: testResults,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
