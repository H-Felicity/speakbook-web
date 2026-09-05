Refactor the existing SpeakBook word/expression selection architecture.

Do NOT redesign the Watch page or Expressions page.

There are currently two bugs:

BUG 1:
When I click the word “weather” and choose Save Expression,
the app saves the hard-coded recommended phrase:

“in any weather”

instead of the actual text I selected:

“weather”

BUG 2:
The Word Popover only works for the hard-coded word “weather”.

For example, if I select Sentence 7:

“let's take a walk through the neighborhood”

and click:

“neighborhood”

nothing happens.

This is incorrect.

The word/expression interaction must work dynamically for ANY sentence and ANY English word or selected phrase.

--------------------------------------------------

CORE ARCHITECTURE

Remove all hard-coded logic tied specifically to:

weather
in any weather
Sentence 3

Create shared selection state such as:

selectedText
selectedSentenceId
selectedSentenceIndex
selectedType
popoverPosition

Example:

selectedText = "neighborhood"
selectedSentenceId = sentence.id
selectedType = "word"

The Popover must render dynamically from the selected text and selected sentence context.

--------------------------------------------------

SENTENCE RENDERING

All English words in the current Watch sentence must be interactive.

Do not manually hard-code clickable spans for individual words.

Render the English sentence dynamically from the current sentence data.

For single-word interaction:

Clicking an English word should:

1. identify the clicked word
2. set selectedText to that exact word
3. set selectedSentenceId to the current sentence
4. set selectedType = "word"
5. open the contextual popover near the clicked word

This must work for every sentence.

For example:

Sentence 3:
weather → popover

Sentence 7:
neighborhood → popover

Sentence 8:
little → popover

Sentence 10:
lunch → popover

No individual word should require hard-coded click logic.

--------------------------------------------------

PHRASE SELECTION

Also support selecting a phrase.

Inside the current English sentence:

If the user drags/selects multiple English words,
detect the selected text using normal browser text selection.

For example:

“I've been meaning to visit this place”

User selects:

“been meaning to”

or:

“have been meaning to”

Then:

selectedText = selected phrase
selectedType = "expression"

Open the same contextual learning popover for that selected phrase.

Single word:
type = "word"

Multiple words:
type = "expression"

--------------------------------------------------

POPOVER

Use one reusable contextual popover component.

The content must be derived from:

selectedText
+
current sentence context

Do not create separate popovers for weather, neighborhood, etc.

For a word such as:

neighborhood

show something like:

neighborhood

/ˈneɪbərhʊd/

noun

街区；社区

In this sentence

这里指当前所在的街区或社区

Original sentence

let's take a walk through the neighborhood

[ + Save Word ]

For a phrase such as:

take a walk

show:

take a walk

散步

Original sentence

let's take a walk through the neighborhood

[ + Save Expression ]

--------------------------------------------------

SAVE BEHAVIOR

This is very important.

The primary Save action must save the EXACT user-selected text.

If the user clicked:

weather

save:

weather

NOT:

in any weather

If the user clicked:

neighborhood

save:

neighborhood

If the user selected:

take a walk

save:

take a walk

If the user selected:

have been meaning to

save:

have been meaning to

--------------------------------------------------

RECOMMENDED EXPRESSIONS

The popover may optionally display:

Recommended expression

but it must be separate from the primary selected item.

For example:

Selected word:

mood

Recommended expression:

be in the mood for...

If the user wants to save the recommendation,
provide a separate explicit action such as:

[ Save “be in the mood for...” ]

Do NOT silently replace the user's selected word with the recommended expression.

--------------------------------------------------

DATA MODEL

Keep one shared savedExpressions collection.

Each saved item should use a structure such as:

{
  id,
  text,
  type,
  meaning,
  pronunciation,
  sentenceId,
  sentenceIndex,
  originalSentence,
  startTime,
  endTime
}

Where:

type = "word" | "expression"

Examples:

{
  text: "weather",
  type: "word",
  sentenceId: ...
}

{
  text: "take a walk",
  type: "expression",
  sentenceId: ...
}

--------------------------------------------------

DEDUPLICATION

Do not save duplicates from the same sentence.

Use a stable identity based on something like:

sentenceId + normalized selectedText

Clicking Save twice must not create duplicate list items.

--------------------------------------------------

EXPRESSIONS LIST

The existing Expressions page must render dynamically from savedExpressions.

“All”:
show all saved items

“Expressions”:
show only items where type = "expression"

“Words”:
show only items where type = "word"

Do not hard-code list contents.

For every item show:

selected text

meaning

original sentence

sentence number

timestamp

play original sentence

--------------------------------------------------

IMPORTANT CONTEXT PRESERVATION

Saving an item must preserve its source sentence.

Example:

neighborhood
Sentence 7
00:51

Clicking its original context later must know:

sentenceId
startTime
endTime

and play the correct original sentence clip.

--------------------------------------------------

VERIFY THESE EXACT TESTS

TEST 1

Open Sentence 3.

Click:

weather

Popover must open.

Save.

Expressions List must contain:

weather

and NOT:

in any weather

--------------------------------------------------

TEST 2

Open Sentence 7.

Click:

neighborhood

Popover must open dynamically.

Save.

Expressions List must now contain:

weather
neighborhood

Count:

2 saved items

--------------------------------------------------

TEST 3

In Sentence 7 select:

take a walk

Popover must open for:

take a walk

Save.

Expressions List must contain:

weather          Word
neighborhood     Word
take a walk      Expression

--------------------------------------------------

TEST 4

Click weather again and Save again.

Do not create a duplicate.

--------------------------------------------------

TEST 5

Expressions filter shows only:

take a walk

Words filter shows:

weather
neighborhood

--------------------------------------------------

Keep all existing:

Watch UI
Shadow UI
currentSentenceIndex
Watch ↔ Shadow context preservation
Recording
Compare
Transcript scrolling

unchanged.

This task is specifically to replace the hard-coded weather demo with a reusable dynamic word and phrase learning system.