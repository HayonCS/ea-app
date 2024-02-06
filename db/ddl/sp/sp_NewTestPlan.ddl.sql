
	CREATE PROCEDURE [dbo].[sp_NewTestPlan] @userName varchar(150),
	@softwareVersion varchar(50),
	@name varchar(255),
	@testPlanID int output AS BEGIN --http://technet.microsoft.com/en-us/library/aa175920(v=sql.80).aspx
	Declare @ErrorCode int
Select
	@ErrorCode = @@ERROR IF LTRIM(RTRIM(@userName)) = '' BEGIN RAISERROR ('Empty user name input field.', 16, 1);

RETURN 1;

END IF LTRIM(RTRIM(@softwareVersion)) = '' BEGIN RAISERROR ('Empty software version input field.', 16, 1);

RETURN 2;

END IF LTRIM(RTRIM(@name)) = '' BEGIN RAISERROR ('Empty test plan name input field.', 16, 1);

RETURN 3;

END DECLARE @theUserID int
SET
	@theUserID = (
		SELECT
			UserID
		FROM
			Users
		WHERE
			Name = @userName
	) IF @theUserID is null BEGIN RAISERROR ('User does not exist.', 16, 1);

RETURN 4;

END --Make sure the user has permissions
DECLARE @isUserReadOnly bit EXEC @ErrorCode = sp_IsUserReadOnly @userName,
@isUserReadOnly = @isUserReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_IsUserReadOnly returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF @isUserReadOnly is null BEGIN RAISERROR (
	'sp_IsUserReadOnly returned NULL for isUserReadOnly.',
	16,
	1
);

RETURN 5;

END IF @isUserReadOnly <> 0 BEGIN RAISERROR ('User does not have permissions.', 16, 1);

RETURN 6;

END
ELSE BEGIN DECLARE @modTime BIGINT
SELECT
	@modTime = (
		SELECT
			DATEDIFF(ss, '1/1/1970 00:00:00', GETUTCDATE())
	) ----START TRANSACTION----------------------------
	Declare @TransactionCountOnEntry int If @ErrorCode = 0 Begin
Select
	@TransactionCountOnEntry = @@TRANCOUNT BEGIN TRANSACTION
End -----------------------------------------------
--Create the Test Plan
If @ErrorCode = 0 BEGIN
INSERT INTO
	TestPlans (Revision, Name, RevisionLabel, SoftwareVersion)
VALUES
	(1, @name, '', @softwareVersion)
SELECT
	@testPlanID = (
		SELECT
			SCOPE_IDENTITY()
	),
	@ErrorCode = @@ERROR
END --Create the root elements
DECLARE @typeID int DECLARE @testPlanElementID int DECLARE @rootElementID int --Test Plan Element
SELECT
	@typeID = (
		SELECT
			ElementTypeID
		FROM
			ElementTypes
		WHERE
			Type = 'TestPlan'
	) If @ErrorCode = 0 BEGIN
INSERT INTO
	Elements (
		Identifier,
		Description,
		Sequence,
		TestPlanId,
		ElementTypeID,
		ParentElementID,
		ModificationTime,
		UserID
	)
VALUES
	(
		'testplan',
		'Test Plan root element',
		1,
		@testPlanID,
		@typeID,
		NULL,
		@modTime,
		@theUserID
	)
SELECT
	@testPlanElementID = (
		SELECT
			SCOPE_IDENTITY()
	),
	@ErrorCode = @@ERROR
END --Requirements Element
SELECT
	@typeID = (
		SELECT
			ElementTypeID
		FROM
			ElementTypes
		WHERE
			Type = 'Requirements'
	) If @ErrorCode = 0 BEGIN
INSERT INTO
	Elements (
		Identifier,
		Description,
		Sequence,
		TestPlanId,
		ElementTypeID,
		ParentElementID,
		ModificationTime,
		UserID
	)
VALUES
	(
		'requirements',
		'Requirements root element',
		1,
		@testPlanID,
		@typeID,
		@testPlanElementID,
		@modTime,
		@theUserID
	)
SELECT
	@rootElementID = (
		SELECT
			SCOPE_IDENTITY()
	),
	@ErrorCode = @@ERROR
END --Tests Element
SELECT
	@typeID = (
		SELECT
			ElementTypeID
		FROM
			ElementTypes
		WHERE
			Type = 'Tests'
	) If @ErrorCode = 0 BEGIN
INSERT INTO
	Elements (
		Identifier,
		Description,
		Sequence,
		TestPlanId,
		ElementTypeID,
		ParentElementID,
		ModificationTime,
		UserID
	)
VALUES
	(
		'tests',
		'Tests root element',
		2,
		@testPlanID,
		@typeID,
		@testPlanElementID,
		@modTime,
		@theUserID
	)
SELECT
	@rootElementID = (
		SELECT
			SCOPE_IDENTITY()
	),
	@ErrorCode = @@ERROR
END --Fixturing Element
SELECT
	@typeID = (
		SELECT
			ElementTypeID
		FROM
			ElementTypes
		WHERE
			Type = 'Fixturing'
	) If @ErrorCode = 0 BEGIN
INSERT INTO
	Elements (
		Identifier,
		Description,
		Sequence,
		TestPlanId,
		ElementTypeID,
		ParentElementID,
		ModificationTime,
		UserID
	)
VALUES
	(
		'fixturing',
		'Fixturing root element',
		3,
		@testPlanID,
		@typeID,
		@testPlanElementID,
		@modTime,
		@theUserID
	)
SELECT
	@rootElementID = (
		SELECT
			SCOPE_IDENTITY()
	),
	@ErrorCode = @@ERROR
END --Flow Element
SELECT
	@typeID = (
		SELECT
			ElementTypeID
		FROM
			ElementTypes
		WHERE
			Type = 'Flow'
	) If @ErrorCode = 0 BEGIN
INSERT INTO
	Elements (
		Identifier,
		Description,
		Sequence,
		TestPlanId,
		ElementTypeID,
		ParentElementID,
		ModificationTime,
		UserID
	)
VALUES
	(
		'flow',
		'Flow root element',
		4,
		@testPlanID,
		@typeID,
		@testPlanElementID,
		@modTime,
		@theUserID
	)
SELECT
	@rootElementID = (
		SELECT
			SCOPE_IDENTITY()
	),
	@ErrorCode = @@ERROR
END ----END TRANSACTION----------------------------
If @@TRANCOUNT > @TransactionCountOnEntry Begin If @ErrorCode = 0 COMMIT TRANSACTION
Else ROLLBACK TRANSACTION
End -----------------------------------------------
END Return @ErrorCode
END

