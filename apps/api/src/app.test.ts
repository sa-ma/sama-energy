import assert from 'node:assert/strict';
import test from 'node:test';

import { createApp } from './app.js';

test('GET /markets returns available market filters', async () => {
  const app = await createApp({ logger: false });

  const response = await app.inject({
    method: 'GET',
    url: '/markets',
  });

  assert.equal(response.statusCode, 200);

  const body = response.json();

  assert.equal(body.markets.length, 3);
  assert.deepEqual(body.markets[0], {
    code: 'GB',
    name: 'Great Britain',
    currency: 'GBP',
    timezone: 'Europe/London',
    supportedDurations: [1, 2, 4],
  });
  assert.deepEqual(body.markets[2], {
    code: 'DE',
    name: 'Germany',
    currency: 'EUR',
    timezone: 'Europe/Berlin',
    supportedDurations: [1, 2, 4],
  });

  await app.close();
});

test('GET /forecast/overview returns a GB overview payload', async () => {
  const app = await createApp({ logger: false });

  const response = await app.inject({
    method: 'GET',
    url: '/forecast/overview?market=GB&durationHours=2&dateRange=12M',
  });

  assert.equal(response.statusCode, 200);

  const body = response.json();

  assert.deepEqual(body.filters, {
    market: 'GB',
    durationHours: 2,
    dateRange: '12M',
  });
  assert.equal(body.summaryMetrics.length, 4);
  assert.equal(body.summaryMetrics[1].id, 'volatility-index');
  assert.equal(body.summaryMetrics[1].unit, 'index');
  assert.equal(body.trendData.length, 12);
  assert.equal(body.forecastPreview.length, 3);
  assert.equal(body.recentSummary.length, 4);
  assert.equal(body.recentSummary[0].metric, 'Avg Revenue');
  assert.equal(body.recentSummary[1].metric, 'Price Spread');

  await app.close();
});

test('GET /forecast/overview returns an ERCOT overview payload', async () => {
  const app = await createApp({ logger: false });

  const response = await app.inject({
    method: 'GET',
    url: '/forecast/overview?market=ERCOT&durationHours=2&dateRange=12M',
  });

  assert.equal(response.statusCode, 200);

  const body = response.json();

  assert.equal(body.filters.market, 'ERCOT');
  assert.equal(body.summaryMetrics.length, 4);
  assert.equal(body.summaryMetrics[0].unit, 'USD/month');
  assert.equal(body.recentSummary[3].metric, 'Volatility Index');

  await app.close();
});

test('GET /forecast/overview returns a DE overview payload', async () => {
  const app = await createApp({ logger: false });

  const response = await app.inject({
    method: 'GET',
    url: '/forecast/overview?market=DE&durationHours=2&dateRange=12M',
  });

  assert.equal(response.statusCode, 200);

  const body = response.json();

  assert.equal(body.filters.market, 'DE');
  assert.equal(body.summaryMetrics[0].unit, 'EUR/month');
  assert.equal(body.trendData.length, 12);

  await app.close();
});

test('GET /comparison returns ordered comparison data', async () => {
  const app = await createApp({ logger: false });

  const response = await app.inject({
    method: 'GET',
    url: '/comparison?markets=ERCOT,GB,DE&durationHours=2&dateRange=12M',
  });

  assert.equal(response.statusCode, 200);

  const body = response.json();

  assert.deepEqual(body.filters, {
    markets: ['ERCOT', 'GB', 'DE'],
    durationHours: 2,
    dateRange: '12M',
    comparisonCurrency: 'GBP',
  });
  assert.equal(body.rows.length, 4);
  assert.deepEqual(body.rows[0].values.length, 3);
  assert.equal(body.chartSeries.length, 3);
  assert.equal(body.chartSeries[0].market, 'ERCOT');
  assert.equal(body.chartSeries[0].unit, 'GBP/month');
  assert.deepEqual(Object.keys(body.rankings), [
    'avg-revenue',
    'volatility-index',
    'utilization',
    'spread-peak',
  ]);

  await app.close();
});

test('GET /comparison rejects too few markets', async () => {
  const app = await createApp({ logger: false });

  const response = await app.inject({
    method: 'GET',
    url: '/comparison?markets=GB&durationHours=2&dateRange=12M',
  });

  assert.equal(response.statusCode, 400);
  assert.equal(response.json().code, 'invalid_markets');

  await app.close();
});

test('GET /comparison rejects duplicate markets', async () => {
  const app = await createApp({ logger: false });

  const response = await app.inject({
    method: 'GET',
    url: '/comparison?markets=GB,GB&durationHours=2&dateRange=12M',
  });

  assert.equal(response.statusCode, 400);
  assert.equal(response.json().code, 'invalid_markets');

  await app.close();
});

test('GET /comparison rejects unsupported duration combinations', async () => {
  const app = await createApp({ logger: false });

  const response = await app.inject({
    method: 'GET',
    url: '/comparison?markets=GB,ERCOT,DE&durationHours=4&dateRange=12M',
  });

  assert.equal(response.statusCode, 400);
  assert.equal(response.json().code, 'unsupported_filters');

  await app.close();
});

test('GET /forecast/overview rejects missing market', async () => {
  const app = await createApp({ logger: false });

  const response = await app.inject({
    method: 'GET',
    url: '/forecast/overview?durationHours=2&dateRange=12M',
  });

  assert.equal(response.statusCode, 400);
  assert.equal(response.json().code, 'validation_error');

  await app.close();
});

test('GET /forecast/overview rejects invalid durationHours', async () => {
  const app = await createApp({ logger: false });

  const response = await app.inject({
    method: 'GET',
    url: '/forecast/overview?market=GB&durationHours=3&dateRange=12M',
  });

  assert.equal(response.statusCode, 400);
  assert.equal(response.json().code, 'validation_error');

  await app.close();
});

test('GET /forecast/overview rejects invalid dateRange', async () => {
  const app = await createApp({ logger: false });

  const response = await app.inject({
    method: 'GET',
    url: '/forecast/overview?market=GB&durationHours=2&dateRange=1Y',
  });

  assert.equal(response.statusCode, 400);
  assert.equal(response.json().code, 'validation_error');

  await app.close();
});

test('GET /forecast/overview rejects unsupported market and duration combinations', async () => {
  const app = await createApp({ logger: false });

  const response = await app.inject({
    method: 'GET',
    url: '/forecast/overview?market=ERCOT&durationHours=4&dateRange=12M',
  });

  assert.equal(response.statusCode, 400);
  assert.equal(response.json().code, 'unsupported_filters');

  await app.close();
});
