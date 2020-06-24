/*
 * action types
 */

export const LOCATION = 'Location'

/*
 * action creators
 */

export function getLocation(loc) {
  return { type: LOCATION, loc }
}