/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { parseEsInterval } from './parse_es_interval';
import { InvalidEsCalendarIntervalError } from './invalid_es_calendar_interval_error';
import { InvalidEsIntervalFormatError } from './invalid_es_interval_format_error';

describe('parseEsInterval', () => {
  it('should correctly parse an interval containing unit and single value', () => {
    expect(parseEsInterval('1ms')).toEqual({ value: 1, unit: 'ms', type: 'fixed' });
    expect(parseEsInterval('1s')).toEqual({ value: 1, unit: 's', type: 'fixed' });
    expect(parseEsInterval('1m')).toEqual({ value: 1, unit: 'm', type: 'calendar' });
    expect(parseEsInterval('1h')).toEqual({ value: 1, unit: 'h', type: 'calendar' });
    expect(parseEsInterval('1d')).toEqual({ value: 1, unit: 'd', type: 'calendar' });
    expect(parseEsInterval('1w')).toEqual({ value: 1, unit: 'w', type: 'calendar' });
    expect(parseEsInterval('1M')).toEqual({ value: 1, unit: 'M', type: 'calendar' });
    expect(parseEsInterval('1y')).toEqual({ value: 1, unit: 'y', type: 'calendar' });
  });

  it('should correctly parse an interval containing unit and multiple value', () => {
    expect(parseEsInterval('250ms')).toEqual({ value: 250, unit: 'ms', type: 'fixed' });
    expect(parseEsInterval('90s')).toEqual({ value: 90, unit: 's', type: 'fixed' });
    expect(parseEsInterval('60m')).toEqual({ value: 60, unit: 'm', type: 'fixed' });
    expect(parseEsInterval('12h')).toEqual({ value: 12, unit: 'h', type: 'fixed' });
    expect(parseEsInterval('7d')).toEqual({ value: 7, unit: 'd', type: 'fixed' });
  });

  it('should throw a InvalidEsCalendarIntervalError for intervals containing calendar unit and multiple value', () => {
    const intervals = ['4w', '12M', '10y'];
    expect.assertions(intervals.length);

    intervals.forEach(interval => {
      try {
        parseEsInterval(interval);
      } catch (error) {
        expect(error instanceof InvalidEsCalendarIntervalError).toBe(true);
      }
    });
  });

  it('should throw a InvalidEsIntervalFormatError for invalid interval formats', () => {
    const intervals = ['1', 'h', '0m', '0.5h'];
    expect.assertions(intervals.length);

    intervals.forEach(interval => {
      try {
        parseEsInterval(interval);
      } catch (error) {
        expect(error instanceof InvalidEsIntervalFormatError).toBe(true);
      }
    });
  });
});