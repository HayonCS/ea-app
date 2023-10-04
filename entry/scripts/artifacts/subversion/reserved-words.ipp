/**
 * @file       ReservedNames.ipp
 * @author     JR Lewis
 * @date       01/20/2015
 * @brief      This file includes the declaration AND implementation of code that checks 
 *             to see if property names are reserved. Keep in mind that the requirements for
 *             this code is:
 *
 *             - Must be included inside of an anonymous namespace.
 */


static const char* builtins[] = 
{
	  "objectName"
	, "parent"
	, "opacity"
	, "enabled"
	, "visible"
	, "pos"
	, "x"
	, "y"
	, "z"
	, "rotation"
	, "scale"
	, "transformOriginPoint"
	, "effect"
	, "children"
	, "width"
	, "height"
	, "parent"
	, "data"
	, "resources"
	, "states"
	, "transitions"
	, "state"
	, "childrenRect"
	, "anchors"
	, "left"
	, "right"
	, "horizontalCenter"
	, "top"
	, "bottom"
	, "verticalCenter"
	, "baseline"
	, "baselineOffset"
	, "clip"
	, "focus"
	, "activeFocus"
	, "transform"
	, "transformOrigin"
	, "transformOriginPoint"
	, "smooth"
	, "implicitWidth"
	, "implicitHeight"
	, "comment"
	, "runtime"
	, "default"
	, "version"

	// Qt5
	, "activeFocusOnTab"
	, "antialiasing"
	, "layer"
	, "visibleChildren"

	// QML
	, "containmentMask"

	// EVERYTHING
	, "description"

	// BINDING CALL
	, "library"
	, "method"

	// JUMP
	, "jump"
	, "jumpOnPass"
	, "jumpOnFail"
	, "jumpOnError"
	, "jumpReturn"
	, "jumpTerminate"
	, "jumpToGroup"

	, "skipped"
	, "sequenceNumber"
	, "initializationStep"
	, "teardownStep"
	, "initialization"
	, "teardown"
	, "initialization"
	, "printElapsed"
	, "loop"
	, "retry"
	, "loopIndex"
	, "retryIndex"
	, "loadStep"
	, "unloadStep"
	, "id"
	, "qmlID"
	, "preExecuteDelay"
	, "postExecuteDelay"
	, "interstitialLoopDelay"
	, "interstitialRetryDelay"

	// Universal Part Numbers
	, "assigned"
	, "managed"
	, "universal"

	// EVALUATION 
	, "high"
	, "low"
	, "type"
	, "subroutine"
	, "value"
	, "measuredValue"
	, "expectedValue"
	, "returnFromSubroutine"

	// EVALUATION TYPES
	, "SCRIPTED"
	, "TOLERANCE"
	, "STRING_COMPARISON"
	, "PASSFAIL"
	, "LIMITCHECK"
	, "EXACT"
	, "COLLECTION"

	, "ordering"
	, "metadata"
	, "printTarget"
	, "printTestMetrics"
	, "runtime_resume"
	, "updateTestMetrics"
	, "__properties__"

	// PART NUMBER
	, "rows"
	, "columns"
	, "sequenceDescription"
	, "sequenceIdentifier"
	, "arrayCode"
	, "SERIAL_ARRAY"
	, "bundlemanagement"
	, "arrayCode"

	, "bindingCallOrEvaluations"
	, "groupChildItems"
	, "testsOrRequirements"
	, "measurementResult"
	, 0
};

