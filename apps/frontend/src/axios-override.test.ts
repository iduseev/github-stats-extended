// @vitest-environment jsdom

// @ts-expect-error type info should be added later
import { router } from "@stats-organization/github-readme-stats-backend";
import { loadConfigFromEnv } from "@stats-organization/github-readme-stats-core";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { clearAxiosCache, setShouldMock } from "./axios-override";
import { DEMO_USER, HOST } from "./constants";
import { createMockRequest, createMockResponse } from "./mock-http";

beforeEach(() => {
  clearAxiosCache();
  setShouldMock(true);
  loadConfigFromEnv({ FETCH_MULTI_PAGE_STARS: "10", PAT_1: "dummyPAT1" });
});

afterEach(() => {
  setShouldMock(false);
  clearAxiosCache();
});

describe("frontend GitHub API mocks", () => {
  it("renders a numeric star total from every mocked stats page", async () => {
    const req = createMockRequest({
      method: "GET",
      url: `https://${HOST}/api?username=${DEMO_USER}&hide_rank=true&number_format=long`,
    });
    const res = createMockResponse();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await router(req, res);

    const body = String(res._getBody());
    const svg = new DOMParser().parseFromString(body, "image/svg+xml");

    expect(svg.querySelector('[data-testid="stars"]')?.textContent).toBe(
      "81135",
    );
    expect(body).not.toContain("NaN");
  });
});
