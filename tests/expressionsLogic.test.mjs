import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import ts from "typescript"

function loadExpressionLogic() {
  const source = readFileSync(
    new URL("../src/utils/expressionLogic.ts", import.meta.url),
    "utf8",
  )
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText
  const module = { exports: {} }
  new Function("exports", "module", compiled)(module.exports, module)
  return module.exports
}

function loadPopoverPosition() {
  const source = readFileSync(
    new URL("../src/utils/popoverPosition.ts", import.meta.url),
    "utf8",
  )
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText
  const module = { exports: {} }
  new Function("exports", "module", compiled)(module.exports, module)
  return module.exports
}

const {
  buildSelectedTerm,
  buildSelectedTermFromText,
  filterSavedExpressions,
  hasSavedExpression,
  saveExpression,
  toggleSavedExpression,
} = loadExpressionLogic()
const { calculatePopoverPosition } = loadPopoverPosition()

const sentence = {
  id: "03",
  startTime: "00:27",
  endTime: "00:33",
  english: "the weather is actually much nicer than I expected",
  chinese: "The weather is better than expected",
}

const sentenceSeven = {
  id: "07",
  startTime: "00:51",
  endTime: "00:57",
  english: "let's take a walk through the neighborhood",
  chinese: "Let's walk through the neighborhood",
}

function runTest(name, testCase) {
  try {
    testCase()
    console.log(`ok - ${name}`)
  } catch (error) {
    console.error(`not ok - ${name}`)
    throw error
  }
}

runTest("buildSelectedTerm identifies generic words and expressions", () => {
  assert.deepEqual(buildSelectedTerm(sentence, [1]), {
    id: "03:weather",
    sentenceId: "03",
    text: "weather",
    normalizedText: "weather",
    type: "word",
    tokenIndexes: [1],
    sentenceText: sentence.english,
    sentenceTranslation: sentence.chinese,
    startTime: "00:27",
    endTime: "00:33",
  })

  assert.deepEqual(buildSelectedTerm(sentence, [4, 5]), {
    id: "03:much-nicer",
    sentenceId: "03",
    text: "much nicer",
    normalizedText: "much nicer",
    type: "expression",
    tokenIndexes: [4, 5],
    sentenceText: sentence.english,
    sentenceTranslation: sentence.chinese,
    startTime: "00:27",
    endTime: "00:33",
  })
})

runTest(
  "buildSelectedTermFromText preserves native selected expression text",
  () => {
    assert.deepEqual(
      buildSelectedTermFromText(sentenceSeven, " take   a walk "),
      {
        id: "07:take-a-walk",
        sentenceId: "07",
        text: "take a walk",
        normalizedText: "take a walk",
        type: "expression",
        tokenIndexes: [1, 2, 3],
        sentenceText: sentenceSeven.english,
        sentenceTranslation: sentenceSeven.chinese,
        startTime: "00:51",
        endTime: "00:57",
      },
    )
  },
)

runTest("buildSelectedTermFromText ignores empty selection text", () => {
  assert.equal(buildSelectedTermFromText(sentenceSeven, "   "), null)
})

runTest("saveExpression deduplicates by normalized selected text", () => {
  const first = saveExpression([], buildSelectedTerm(sentence, [1]))
  const second = saveExpression(first, buildSelectedTerm(sentence, [1]))

  assert.equal(first.length, 1)
  assert.equal(second.length, 1)
  assert.equal(second[0].text, "weather")
})

runTest("toggleSavedExpression adds an unsaved term", () => {
  const weather = buildSelectedTerm(sentence, [1])
  const toggled = toggleSavedExpression(
    [],
    weather,
    "天气；气象",
    "Weather note",
  )

  assert.equal(toggled.length, 1)
  assert.equal(toggled[0].sentenceId, "03")
  assert.equal(toggled[0].normalizedText, "weather")
  assert.equal(hasSavedExpression(toggled, weather), true)
})

runTest("toggleSavedExpression removes the same saved term", () => {
  const weather = buildSelectedTerm(sentence, [1])
  const saved = toggleSavedExpression([], weather, "天气；气象", "Weather note")
  const removed = toggleSavedExpression(
    saved,
    weather,
    "天气；气象",
    "Weather note",
  )

  assert.deepEqual(removed, [])
  assert.equal(hasSavedExpression(removed, weather), false)
})

runTest("toggleSavedExpression cycles without creating duplicates", () => {
  const weather = buildSelectedTerm(sentence, [1])
  const savedOnce = toggleSavedExpression([], weather)
  const removed = toggleSavedExpression(savedOnce, weather)
  const savedAgain = toggleSavedExpression(removed, weather)
  const duplicateAttempt = saveExpression(savedAgain, weather)

  assert.equal(savedAgain.length, 1)
  assert.equal(duplicateAttempt.length, 1)
})

runTest(
  "toggleSavedExpression removes same text from one sentence only",
  () => {
    const firstWeather = buildSelectedTerm(sentence, [1])
    const laterSentence = {
      ...sentence,
      id: "09",
      startTime: "01:03",
      endTime: "01:09",
      english: "the weather feels warm today",
    }
    const secondWeather = buildSelectedTerm(laterSentence, [1])
    const saved = toggleSavedExpression(
      toggleSavedExpression([], firstWeather),
      secondWeather,
    )
    const removedFirst = toggleSavedExpression(saved, firstWeather)

    assert.equal(removedFirst.length, 1)
    assert.equal(removedFirst[0].sentenceId, "09")
    assert.equal(removedFirst[0].normalizedText, "weather")
  },
)

runTest(
  "saved identity uses normalized text with case whitespace and punctuation",
  () => {
    const weather = buildSelectedTerm(sentence, [1])
    const noisyWeather = buildSelectedTermFromText(sentence, "  Weather!  ")
    const saved = toggleSavedExpression([], weather)

    assert.notEqual(noisyWeather, null)
    assert.equal(hasSavedExpression(saved, noisyWeather), true)
    assert.deepEqual(toggleSavedExpression(saved, noisyWeather), [])
  },
)

runTest("filterSavedExpressions narrows by type", () => {
  const saved = [
    saveExpression([], buildSelectedTerm(sentence, [1]))[0],
    saveExpression([], buildSelectedTerm(sentence, [4, 5]))[0],
  ]

  assert.deepEqual(
    filterSavedExpressions(saved, { type: "expression" }).map(
      (item) => item.text,
    ),
    ["much nicer"],
  )
})

runTest(
  "calculatePopoverPosition keeps popover below when enough space exists",
  () => {
    assert.deepEqual(
      calculatePopoverPosition({
        anchorRect: { left: 200, top: 120, width: 80, height: 24 },
        popoverSize: { width: 340, height: 260 },
        viewportSize: { width: 900, height: 700 },
        margin: 16,
        gap: 12,
      }),
      {
        top: 156,
        left: 70,
        maxHeight: 668,
        placement: "bottom",
      },
    )
  },
)

runTest(
  "calculatePopoverPosition flips above when lower space is insufficient",
  () => {
    assert.deepEqual(
      calculatePopoverPosition({
        anchorRect: { left: 200, top: 560, width: 80, height: 24 },
        popoverSize: { width: 340, height: 220 },
        viewportSize: { width: 900, height: 700 },
        margin: 16,
        gap: 12,
      }),
      {
        top: 328,
        left: 70,
        maxHeight: 668,
        placement: "top",
      },
    )
  },
)

runTest("calculatePopoverPosition clamps left edge", () => {
  assert.equal(
    calculatePopoverPosition({
      anchorRect: { left: 6, top: 120, width: 20, height: 24 },
      popoverSize: { width: 340, height: 220 },
      viewportSize: { width: 900, height: 700 },
      margin: 16,
      gap: 12,
    }).left,
    16,
  )
})

runTest("calculatePopoverPosition clamps right edge", () => {
  assert.equal(
    calculatePopoverPosition({
      anchorRect: { left: 860, top: 120, width: 30, height: 24 },
      popoverSize: { width: 340, height: 220 },
      viewportSize: { width: 900, height: 700 },
      margin: 16,
      gap: 12,
    }).left,
    544,
  )
})

runTest(
  "calculatePopoverPosition returns viewport-safe height for tall popovers",
  () => {
    assert.deepEqual(
      calculatePopoverPosition({
        anchorRect: { left: 200, top: 300, width: 80, height: 24 },
        popoverSize: { width: 340, height: 900 },
        viewportSize: { width: 900, height: 700 },
        margin: 16,
        gap: 12,
      }),
      {
        top: 16,
        left: 70,
        maxHeight: 668,
        placement: "top",
      },
    )
  },
)
