const { Builder, By, until, error: seleniumError } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("node:fs");
const path = require("node:path");

const localEnvPath = path.join(__dirname, ".env.e2e.local");
if (fs.existsSync(localEnvPath)) {
  for (const rawLine of fs.readFileSync(localEnvPath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const splitAt = line.indexOf("=");
    const key = line.slice(0, splitAt).trim();
    const value = line.slice(splitAt + 1).trim().replace(/^['"]|['"]$/g, "");
    process.env[key] ??= value;
  }
}

const config = {
  baseUrl: process.env.E2E_BASE_URL || "https://project-management-platform-eight.vercel.app",
  adminEmail: process.env.E2E_ADMIN_EMAIL,
  adminPassword: process.env.E2E_ADMIN_PASSWORD,
  managerEmail: process.env.E2E_MANAGER_EMAIL,
  managerPassword: process.env.E2E_MANAGER_PASSWORD,
  memberEmail: process.env.E2E_MEMBER_EMAIL,
  memberPassword: process.env.E2E_MEMBER_PASSWORD,
  headless: process.env.E2E_HEADLESS === "1",
  stepDelay: Number(process.env.E2E_STEP_DELAY_MS || 2200),
  chapterDelay: Number(process.env.E2E_CHAPTER_DELAY_MS || 3400),
  timeout: Number(process.env.E2E_TIMEOUT_MS || 90000),
  failurePause: Number(process.env.E2E_FAILURE_PAUSE_MS || 20000)
};

for (const key of ["adminEmail", "adminPassword", "managerEmail", "managerPassword", "memberEmail", "memberPassword"]) {
  if (!config[key]) throw new Error(`Missing required environment value: ${key}`);
}

const runId = Date.now().toString().slice(-7);
const demoUser = {
  name: `Video Demo Member ${runId}`,
  email: `video.member.${runId}@pulsedeck.demo`,
  password: `Video@${runId}Test`
};
const demoProject = `Website Launch ${runId}`;
const demoTask = `Review launch checklist ${runId}`;
const sleep = (driver, milliseconds = config.stepDelay) => driver.sleep(milliseconds);

async function chapter(driver, title, subtitle) {
  console.log(`\n▶ ${title}${subtitle ? ` — ${subtitle}` : ""}`);
  await waitForPage(driver);
  await driver.executeScript((heading, text) => {
    document.getElementById("e2e-video-chapter")?.remove();
    const banner = document.createElement("div");
    banner.id = "e2e-video-chapter";
    banner.style.cssText = "position:fixed;left:50%;top:26px;transform:translateX(-50%);z-index:999999;background:#17233b;color:white;padding:14px 24px;border-radius:14px;box-shadow:0 12px 36px rgba(0,0,0,.22);font:600 16px system-ui;text-align:center;min-width:320px";
    banner.innerHTML = `<div>${heading}</div><div style="margin-top:4px;font-size:12px;font-weight:400;opacity:.8">${text || ""}</div>`;
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 3100);
  }, title, subtitle || "");
  await sleep(driver, config.chapterDelay);
}

async function waitForPage(driver) {
  await driver.wait(async () => (await driver.executeScript("return document.readyState")) === "complete", config.timeout);
  await driver.wait(async () => (await driver.findElements(By.css("body"))).length === 1, config.timeout);
}

async function visible(driver, locator, timeout = config.timeout) {
  const element = await driver.wait(until.elementLocated(locator), timeout);
  await driver.wait(until.elementIsVisible(element), timeout);
  return element;
}

async function click(driver, locator) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const element = await visible(driver, locator);
      await driver.executeScript("arguments[0].scrollIntoView({block:'center',behavior:'smooth'})", element);
      await sleep(driver, 700);
      await driver.wait(until.elementIsEnabled(element), 15000);
      try { await element.click(); } catch (error) {
        if (!(error instanceof seleniumError.ElementClickInterceptedError)) throw error;
        await driver.executeScript("arguments[0].click()", element);
      }
      await sleep(driver);
      return element;
    } catch (error) {
      lastError = error;
      console.log(`  Retrying click (${attempt}/3)...`);
      await sleep(driver, 1500);
    }
  }
  throw lastError;
}

async function type(driver, locator, value) {
  const element = await visible(driver, locator);
  await driver.executeScript("arguments[0].scrollIntoView({block:'center',behavior:'smooth'})", element);
  await element.clear();
  await element.sendKeys(value);
  await sleep(driver, 700);
  return element;
}

async function setNativeValue(driver, locator, value) {
  const element = await visible(driver, locator);
  await driver.executeScript((input, nextValue) => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    setter.call(input, nextValue);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }, element, value);
  await sleep(driver, 900);
}

async function waitForSuccess(driver, message) {
  await visible(driver, By.xpath(`//*[contains(normalize-space(),${JSON.stringify(message)})]`), config.timeout);
  await sleep(driver);
}

async function selectByText(driver, label, text) {
  const select = await visible(driver, By.xpath(`//label[normalize-space()='${label}']/following::select[1]`));
  await driver.executeScript("arguments[0].scrollIntoView({block:'center'})", select);
  await select.findElement(By.xpath(`.//option[normalize-space()='${text}']`)).click();
  await sleep(driver);
}

async function login(driver, email, password, label) {
  console.log(`\nSigning in as ${label}...`);
  await driver.get(`${config.baseUrl}/login`);
  await driver.manage().window().maximize();
  await waitForPage(driver);
  await chapter(driver, `${label} login`, "Secure role-based access");
  await type(driver, By.name("email"), email);
  await type(driver, By.name("password"), password);
  await click(driver, By.xpath("//button[normalize-space()='Sign in']"));
  await driver.wait(async () => {
    if ((await driver.getCurrentUrl()).includes("dashboard")) return true;
    const errors = await driver.findElements(By.xpath("//*[contains(normalize-space(),'Sign in failed')]"));
    if (errors.length) throw new Error(`${label} login failed. Check the email/password in e2e/.env.e2e.local and confirm Render seed completed.`);
    return false;
  }, config.timeout);
  await waitForPage(driver);
  console.log(`  ${label} login successful.`);
}

async function logout(driver) {
  await click(driver, By.xpath("//button[normalize-space()='Logout']"));
  await driver.wait(until.urlContains("login"), 15000);
}

async function adminFlow(driver) {
  await login(driver, config.adminEmail, config.adminPassword, "Administrator");
  await chapter(driver, "Administrator dashboard", "Users, projects, tasks and completion summary");
  await sleep(driver);

  await click(driver, By.linkText("Users"));
  await chapter(driver, "User management", "Create a secure standard-user account");
  await type(driver, By.name("fullName"), demoUser.name);
  await type(driver, By.name("userEmail"), demoUser.email);
  await type(driver, By.id("userPassword"), demoUser.password);
  await click(driver, By.xpath("//button[normalize-space()='Create user']"));
  await waitForSuccess(driver, "User created.");

  console.log("\nOpening Administrator Projects page...");
  await driver.get(`${config.baseUrl}/admin/projects`);
  await waitForPage(driver);
  await driver.executeScript("window.scrollTo({top:0,left:0,behavior:'instant'})");
  await chapter(driver, "Project workspace", "Create a project with an automatic project code");
  await click(driver, By.xpath("//button[contains(normalize-space(),'New project')]"));
  await visible(driver, By.xpath("//h3[normalize-space()='Create project']"));
  const projectNameInput = await visible(driver, By.xpath("//label[normalize-space()='Project name']/following::input[1]"));
  await projectNameInput.sendKeys(demoProject);
  await setNativeValue(driver, By.xpath("//label[normalize-space()='Start date']/following::input[1]"), new Date().toISOString().slice(0, 10));
  const end = new Date(Date.now() + 21 * 86400000).toISOString().slice(0, 10);
  await setNativeValue(driver, By.xpath("//label[normalize-space()='Target end date']/following::input[1]"), end);
  await type(driver, By.xpath("//label[normalize-space()='Project description']/following::textarea[1]"), "Prepare and launch the new responsive customer website with the project team.");
  await click(driver, By.xpath("//button[normalize-space()='Create project']"));
  await waitForSuccess(driver, "Project created with an automatic project code.");
  await click(driver, By.xpath(`//button[.//*[normalize-space()='${demoProject}']]`));

  await chapter(driver, "Project membership", "Add a user as a Team Member");
  await selectByText(driver, "User", demoUser.name);
  await selectByText(driver, "Project role", "Team Member");
  await click(driver, By.xpath("//button[normalize-space()='Add member']"));
  await waitForSuccess(driver, "Member added.");

  await chapter(driver, "Task management", "Create and assign a high-priority task");
  await click(driver, By.xpath("//button[contains(normalize-space(),'+ Add task')]"));
  await selectByText(driver, "Assignee", demoUser.name);
  await type(driver, By.xpath("//label[normalize-space()='Task title']/following::input[1]"), demoTask);
  await setNativeValue(driver, By.xpath("//label[normalize-space()='Due date']/following::input[1]"), new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10));
  await selectByText(driver, "Priority", "HIGH");
  await type(driver, By.xpath("//label[normalize-space()='Task description']/following::textarea[1]"), "Review the launch checklist and report any remaining issues before release.");
  await click(driver, By.xpath("//button[normalize-space()='Add to board']"));
  await waitForSuccess(driver, "Task added to the board.");

  await click(driver, By.linkText("Notifications"));
  await chapter(driver, "Notifications", "Assignments and deadline reminders");
  const unread = await driver.findElements(By.xpath("//button[normalize-space()='Mark read']"));
  if (unread.length) { await unread[0].click(); await sleep(driver); }

  await click(driver, By.linkText("Activity"));
  await chapter(driver, "Administrator activity", "Important system actions are recorded");
  await sleep(driver);
  await logout(driver);
}

async function memberFlow(driver) {
  await login(driver, demoUser.email, demoUser.password, "Team Member");
  await chapter(driver, "Team Member dashboard", "Only permitted project information is shown");
  await click(driver, By.linkText("Projects"));
  await click(driver, By.xpath(`//button[.//*[normalize-space()='${demoProject}']]`));
  await chapter(driver, "Assigned project and task", "Update only the task assigned to this member");
  let card = await visible(driver, By.xpath(`//article[.//h4[normalize-space()='${demoTask}']]`));
  const status = await card.findElement(By.css("select"));
  await status.findElement(By.css("option[value='IN_PROGRESS']")).click();
  await waitForSuccess(driver, "Task moved.");

  await chapter(driver, "Task collaboration", "Add a progress comment");
  card = await visible(driver, By.xpath(`//article[.//h4[normalize-space()='${demoTask}']]`));
  const comment = await card.findElement(By.css("input[placeholder='Add comment...']"));
  await comment.sendKeys("Checklist review started. I will post the final update before the deadline.");
  await card.findElement(By.xpath(".//button[normalize-space()='Send']")).click();
  await waitForSuccess(driver, "Comment added.");

  await click(driver, By.linkText("Notifications"));
  await chapter(driver, "Personal notifications", "Each user can access only their own notifications");
  await click(driver, By.linkText("Profile"));
  await chapter(driver, "Profile management", "Users can manage their own profile and password");
  await logout(driver);
}

async function rolePreview(driver, email, password, roleName) {
  await login(driver, email, password, roleName);
  await chapter(driver, `${roleName} workspace`, "Role-specific dashboard and navigation");
  await click(driver, By.linkText("Projects"));
  await chapter(driver, `${roleName} project access`, "Project controls follow membership permissions");
  await logout(driver);
}

(async () => {
  const options = new chrome.Options();
  options.addArguments("--start-maximized", "--disable-notifications", "--disable-popup-blocking", "--disable-features=TrackingProtection3pcd");
  options.setUserPreferences({ "profile.default_content_setting_values.notifications": 2, "profile.default_content_setting_values.cookies": 1 });
  if (config.headless) options.addArguments("--headless=new", "--window-size=1440,1000");
  const driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
  try {
    await adminFlow(driver);
    await memberFlow(driver);
    await rolePreview(driver, config.managerEmail, config.managerPassword, "Project Manager");
    await rolePreview(driver, config.memberEmail, config.memberPassword, "Seeded Team Member");
    await driver.get(config.baseUrl);
    await chapter(driver, "PulseDeck demonstration complete", "Administrator, Project Manager and Team Member flows tested");
    await sleep(driver, 6000);
    console.log(`E2E recording flow passed. Created ${demoProject} and ${demoUser.email}.`);
  } catch (error) {
    console.error("E2E recording flow failed:", error);
    fs.mkdirSync(path.join(__dirname, "artifacts"), { recursive: true });
    const screenshotPath = path.join(__dirname, "artifacts", `failure-${Date.now()}.png`);
    fs.writeFileSync(screenshotPath, await driver.takeScreenshot(), "base64");
    console.error(`Failure screenshot saved to ${screenshotPath}`);
    console.error(`Browser stopped at: ${await driver.getCurrentUrl()}`);
    process.exitCode = 1;
    await sleep(driver, config.failurePause);
  } finally {
    await driver.quit();
  }
})();
