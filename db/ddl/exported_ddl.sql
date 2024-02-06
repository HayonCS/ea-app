	/****** Object:  Table [dbo].[CoverageMapping]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE TABLE [dbo].[CoverageMapping](
		[CoverageMappingID] [int] IDENTITY(1, 1) NOT NULL,
		[FailureModeID] [int] NOT NULL,
		[EvaluationID] [int] NOT NULL,
		CONSTRAINT [CoverageMappingID] PRIMARY KEY CLUSTERED ([CoverageMappingID] ASC) WITH (
			PAD_INDEX = OFF,
			STATISTICS_NORECOMPUTE = OFF,
			IGNORE_DUP_KEY = OFF,
			ALLOW_ROW_LOCKS = ON,
			ALLOW_PAGE_LOCKS = ON,
			FILLFACTOR = 90
		) ON [PRIMARY]
	) ON [PRIMARY]
GO
	/****** Object:  Table [dbo].[Elements]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE TABLE [dbo].[Elements](
		[ElementID] [int] IDENTITY(1, 1) NOT NULL,
		[Identifier] [varchar](255) NOT NULL,
		[Description] [varchar](2000) NOT NULL,
		[Sequence] [smallint] NOT NULL,
		[TestPlanID] [int] NOT NULL,
		[ElementTypeID] [int] NOT NULL,
		[ParentElementID] [int] NULL,
		[ModificationTime] [bigint] NOT NULL,
		[UserID] [int] NOT NULL,
		CONSTRAINT [ElementID] PRIMARY KEY CLUSTERED ([ElementID] ASC) WITH (
			PAD_INDEX = OFF,
			STATISTICS_NORECOMPUTE = OFF,
			IGNORE_DUP_KEY = OFF,
			ALLOW_ROW_LOCKS = ON,
			ALLOW_PAGE_LOCKS = ON,
			FILLFACTOR = 90
		) ON [PRIMARY]
	) ON [PRIMARY]
GO
	/****** Object:  Table [dbo].[ElementTags]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE TABLE [dbo].[ElementTags](
		[ElementTagID] [int] IDENTITY(1, 1) NOT NULL,
		[TagID] [int] NOT NULL,
		[ElementID] [int] NOT NULL,
		CONSTRAINT [ElementTagID] PRIMARY KEY CLUSTERED ([ElementTagID] ASC) WITH (
			PAD_INDEX = OFF,
			STATISTICS_NORECOMPUTE = OFF,
			IGNORE_DUP_KEY = OFF,
			ALLOW_ROW_LOCKS = ON,
			ALLOW_PAGE_LOCKS = ON,
			FILLFACTOR = 90
		) ON [PRIMARY]
	) ON [PRIMARY]
GO
	/****** Object:  Table [dbo].[ElementTypes]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE TABLE [dbo].[ElementTypes](
		[ElementTypeID] [int] IDENTITY(1, 1) NOT NULL,
		[Type] [varchar](150) NOT NULL,
		CONSTRAINT [ElementTypeID] PRIMARY KEY CLUSTERED ([ElementTypeID] ASC) WITH (
			PAD_INDEX = OFF,
			STATISTICS_NORECOMPUTE = OFF,
			IGNORE_DUP_KEY = OFF,
			ALLOW_ROW_LOCKS = ON,
			ALLOW_PAGE_LOCKS = ON,
			FILLFACTOR = 90
		) ON [PRIMARY]
	) ON [PRIMARY]
GO
	/****** Object:  Table [dbo].[FixtureMapping]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE TABLE [dbo].[FixtureMapping](
		[FixtureMappingID] [int] IDENTITY(1, 1) NOT NULL,
		[TestStationID] [int] NOT NULL,
		[TestFixtureID] [int] NOT NULL,
		CONSTRAINT [FixtureMappingID] PRIMARY KEY CLUSTERED ([FixtureMappingID] ASC) WITH (
			PAD_INDEX = OFF,
			STATISTICS_NORECOMPUTE = OFF,
			IGNORE_DUP_KEY = OFF,
			ALLOW_ROW_LOCKS = ON,
			ALLOW_PAGE_LOCKS = ON,
			FILLFACTOR = 90
		) ON [PRIMARY]
	) ON [PRIMARY]
GO
	/****** Object:  Table [dbo].[Logs]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE TABLE [dbo].[Logs](
		[LogID] [int] IDENTITY(1, 1) NOT NULL,
		[UserID] [int] NOT NULL,
		[TimeDateStamp] [datetime2](7) NOT NULL,
		[Message] [varchar](max) NOT NULL,
		[TestPlanID] [int] NOT NULL,
		CONSTRAINT [LogID] PRIMARY KEY CLUSTERED ([LogID] ASC) WITH (
			PAD_INDEX = OFF,
			STATISTICS_NORECOMPUTE = OFF,
			IGNORE_DUP_KEY = OFF,
			ALLOW_ROW_LOCKS = ON,
			ALLOW_PAGE_LOCKS = ON,
			FILLFACTOR = 90
		) ON [PRIMARY]
	) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
	/****** Object:  Table [dbo].[Properties]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE TABLE [dbo].[Properties](
		[PropertyID] [int] IDENTITY(1, 1) NOT NULL,
		[Value] [varchar](max) NOT NULL,
		[Name] [varchar](255) NOT NULL,
		[ElementID] [int] NOT NULL,
		[PropertyTypeID] [int] NOT NULL,
		[Description] [varchar](max) NOT NULL,
		[ModificationTime] [bigint] NOT NULL,
		[UserID] [int] NOT NULL,
		CONSTRAINT [PropertyID] PRIMARY KEY CLUSTERED ([PropertyID] ASC) WITH (
			PAD_INDEX = OFF,
			STATISTICS_NORECOMPUTE = OFF,
			IGNORE_DUP_KEY = OFF,
			ALLOW_ROW_LOCKS = ON,
			ALLOW_PAGE_LOCKS = ON,
			FILLFACTOR = 90
		) ON [PRIMARY]
	) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
	/****** Object:  Table [dbo].[PropertyTypes]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE TABLE [dbo].[PropertyTypes](
		[PropertyTypeID] [int] IDENTITY(1, 1) NOT NULL,
		[Type] [varchar](150) NOT NULL,
		CONSTRAINT [PropertyTypeID] PRIMARY KEY CLUSTERED ([PropertyTypeID] ASC) WITH (
			PAD_INDEX = OFF,
			STATISTICS_NORECOMPUTE = OFF,
			IGNORE_DUP_KEY = OFF,
			ALLOW_ROW_LOCKS = ON,
			ALLOW_PAGE_LOCKS = ON,
			FILLFACTOR = 90
		) ON [PRIMARY]
	) ON [PRIMARY]
GO
	/****** Object:  Table [dbo].[Tags]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE TABLE [dbo].[Tags](
		[TagID] [int] IDENTITY(1, 1) NOT NULL,
		[Name] [varchar](150) NOT NULL,
		CONSTRAINT [TagID] PRIMARY KEY CLUSTERED ([TagID] ASC) WITH (
			PAD_INDEX = OFF,
			STATISTICS_NORECOMPUTE = OFF,
			IGNORE_DUP_KEY = OFF,
			ALLOW_ROW_LOCKS = ON,
			ALLOW_PAGE_LOCKS = ON,
			FILLFACTOR = 90
		) ON [PRIMARY]
	) ON [PRIMARY]
GO
	/****** Object:  Table [dbo].[TesterMapping]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE TABLE [dbo].[TesterMapping](
		[TesterMappingID] [int] IDENTITY(1, 1) NOT NULL,
		[TestStationID] [int] NOT NULL,
		[TesterID] [int] NOT NULL,
		CONSTRAINT [TesterMappingID] PRIMARY KEY CLUSTERED ([TesterMappingID] ASC) WITH (
			PAD_INDEX = OFF,
			STATISTICS_NORECOMPUTE = OFF,
			IGNORE_DUP_KEY = OFF,
			ALLOW_ROW_LOCKS = ON,
			ALLOW_PAGE_LOCKS = ON,
			FILLFACTOR = 90
		) ON [PRIMARY]
	) ON [PRIMARY]
GO
	/****** Object:  Table [dbo].[TestPlans]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE TABLE [dbo].[TestPlans](
		[TestPlanID] [int] IDENTITY(1, 1) NOT NULL,
		[Revision] [int] NOT NULL,
		[Name] [varchar](255) NOT NULL,
		[RevisionLabel] [varchar](255) NOT NULL,
		[SoftwareVersion] [varchar](50) NOT NULL,
		[Visible] [bit] NOT NULL,
		CONSTRAINT [TestPlanID] PRIMARY KEY CLUSTERED ([TestPlanID] ASC) WITH (
			PAD_INDEX = OFF,
			STATISTICS_NORECOMPUTE = OFF,
			IGNORE_DUP_KEY = OFF,
			ALLOW_ROW_LOCKS = ON,
			ALLOW_PAGE_LOCKS = ON,
			FILLFACTOR = 90
		) ON [PRIMARY]
	) ON [PRIMARY]
GO
	/****** Object:  Table [dbo].[Users]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE TABLE [dbo].[Users](
		[UserID] [int] IDENTITY(1, 1) NOT NULL,
		[Name] [varchar](150) NOT NULL,
		[Phone] [varchar](50) NOT NULL,
		[EMail] [varchar](150) NOT NULL,
		[Manager] [varchar](150) NOT NULL,
		[Location] [varchar](150) NOT NULL,
		[ReadOnly] [bit] NOT NULL,
		CONSTRAINT [UserID] PRIMARY KEY CLUSTERED ([UserID] ASC) WITH (
			PAD_INDEX = OFF,
			STATISTICS_NORECOMPUTE = OFF,
			IGNORE_DUP_KEY = OFF,
			ALLOW_ROW_LOCKS = ON,
			ALLOW_PAGE_LOCKS = ON,
			FILLFACTOR = 90
		) ON [PRIMARY]
	) ON [PRIMARY]
GO

ALTER TABLE 
	[dbo].[Users]
ADD
	[EmployeeNumber] [varchar](50) NULL
GO

ALTER TABLE
	[dbo].[Logs]
ADD
	CONSTRAINT [DF__Logs__TimeDateSt__1920BF5C] DEFAULT (getutcdate()) FOR [TimeDateStamp]
GO
ALTER TABLE
	[dbo].[TestPlans]
ADD
	CONSTRAINT [DF__TestPlans__Visib__4376EBDB] DEFAULT ((1)) FOR [Visible]
GO
ALTER TABLE
	[dbo].[Users]
ADD
	CONSTRAINT [DF__Users__ReadOnly__1273C1CD] DEFAULT ((1)) FOR [ReadOnly]
GO
ALTER TABLE
	[dbo].[CoverageMapping] WITH CHECK
ADD
	CONSTRAINT [Elements_CoverageMapping_fk] FOREIGN KEY([FailureModeID]) REFERENCES [dbo].[Elements] ([ElementID])
GO
ALTER TABLE
	[dbo].[CoverageMapping] CHECK CONSTRAINT [Elements_CoverageMapping_fk]
GO
ALTER TABLE
	[dbo].[CoverageMapping] WITH CHECK
ADD
	CONSTRAINT [Elements_CoverageMapping_fk1] FOREIGN KEY([EvaluationID]) REFERENCES [dbo].[Elements] ([ElementID])
GO
ALTER TABLE
	[dbo].[CoverageMapping] CHECK CONSTRAINT [Elements_CoverageMapping_fk1]
GO
ALTER TABLE
	[dbo].[Elements] WITH CHECK
ADD
	CONSTRAINT [Elements_Elements_fk] FOREIGN KEY([ParentElementID]) REFERENCES [dbo].[Elements] ([ElementID])
GO
ALTER TABLE
	[dbo].[Elements] CHECK CONSTRAINT [Elements_Elements_fk]
GO
ALTER TABLE
	[dbo].[Elements] WITH CHECK
ADD
	CONSTRAINT [ElementTypes_Elements_fk] FOREIGN KEY([ElementTypeID]) REFERENCES [dbo].[ElementTypes] ([ElementTypeID])
GO
ALTER TABLE
	[dbo].[Elements] CHECK CONSTRAINT [ElementTypes_Elements_fk]
GO
ALTER TABLE
	[dbo].[Elements] WITH CHECK
ADD
	CONSTRAINT [TestPlans_Elements_fk] FOREIGN KEY([TestPlanID]) REFERENCES [dbo].[TestPlans] ([TestPlanID])
GO
ALTER TABLE
	[dbo].[Elements] CHECK CONSTRAINT [TestPlans_Elements_fk]
GO
ALTER TABLE
	[dbo].[Elements] WITH CHECK
ADD
	CONSTRAINT [Users_Elements_fk] FOREIGN KEY([UserID]) REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE
	[dbo].[Elements] CHECK CONSTRAINT [Users_Elements_fk]
GO
ALTER TABLE
	[dbo].[ElementTags] WITH CHECK
ADD
	CONSTRAINT [Elements_ElementTags_fk] FOREIGN KEY([ElementID]) REFERENCES [dbo].[Elements] ([ElementID]) ON DELETE CASCADE
GO
ALTER TABLE
	[dbo].[ElementTags] CHECK CONSTRAINT [Elements_ElementTags_fk]
GO
ALTER TABLE
	[dbo].[ElementTags] WITH CHECK
ADD
	CONSTRAINT [Tags_ElementTags_fk] FOREIGN KEY([TagID]) REFERENCES [dbo].[Tags] ([TagID])
GO
ALTER TABLE
	[dbo].[ElementTags] CHECK CONSTRAINT [Tags_ElementTags_fk]
GO
ALTER TABLE
	[dbo].[FixtureMapping] WITH CHECK
ADD
	CONSTRAINT [Elements_FixtureMapping_fk] FOREIGN KEY([TestStationID]) REFERENCES [dbo].[Elements] ([ElementID])
GO
ALTER TABLE
	[dbo].[FixtureMapping] CHECK CONSTRAINT [Elements_FixtureMapping_fk]
GO
ALTER TABLE
	[dbo].[FixtureMapping] WITH CHECK
ADD
	CONSTRAINT [Elements_FixtureMapping_fk1] FOREIGN KEY([TestFixtureID]) REFERENCES [dbo].[Elements] ([ElementID])
GO
ALTER TABLE
	[dbo].[FixtureMapping] CHECK CONSTRAINT [Elements_FixtureMapping_fk1]
GO
ALTER TABLE
	[dbo].[Logs] WITH CHECK
ADD
	CONSTRAINT [TestPlans_Logs_fk] FOREIGN KEY([TestPlanID]) REFERENCES [dbo].[TestPlans] ([TestPlanID])
GO
ALTER TABLE
	[dbo].[Logs] CHECK CONSTRAINT [TestPlans_Logs_fk]
GO
ALTER TABLE
	[dbo].[Logs] WITH CHECK
ADD
	CONSTRAINT [Users_Logs_fk] FOREIGN KEY([UserID]) REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE
	[dbo].[Logs] CHECK CONSTRAINT [Users_Logs_fk]
GO
ALTER TABLE
	[dbo].[Properties] WITH CHECK
ADD
	CONSTRAINT [Elements_Properties_fk] FOREIGN KEY([ElementID]) REFERENCES [dbo].[Elements] ([ElementID]) ON DELETE CASCADE
GO
ALTER TABLE
	[dbo].[Properties] CHECK CONSTRAINT [Elements_Properties_fk]
GO
ALTER TABLE
	[dbo].[Properties] WITH CHECK
ADD
	CONSTRAINT [PropertyTypes_Properties_fk] FOREIGN KEY([PropertyTypeID]) REFERENCES [dbo].[PropertyTypes] ([PropertyTypeID])
GO
ALTER TABLE
	[dbo].[Properties] CHECK CONSTRAINT [PropertyTypes_Properties_fk]
GO
ALTER TABLE
	[dbo].[Properties] WITH CHECK
ADD
	CONSTRAINT [Users_Properties_fk] FOREIGN KEY([UserID]) REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE
	[dbo].[Properties] CHECK CONSTRAINT [Users_Properties_fk]
GO
ALTER TABLE
	[dbo].[TesterMapping] WITH CHECK
ADD
	CONSTRAINT [Elements_TesterMapping_fk] FOREIGN KEY([TestStationID]) REFERENCES [dbo].[Elements] ([ElementID])
GO
ALTER TABLE
	[dbo].[TesterMapping] CHECK CONSTRAINT [Elements_TesterMapping_fk]
GO
ALTER TABLE
	[dbo].[TesterMapping] WITH CHECK
ADD
	CONSTRAINT [Elements_TesterMapping_fk1] FOREIGN KEY([TesterID]) REFERENCES [dbo].[Elements] ([ElementID])
GO
ALTER TABLE
	[dbo].[TesterMapping] CHECK CONSTRAINT [Elements_TesterMapping_fk1]
GO
ALTER TABLE
	[dbo].[Elements] WITH CHECK
ADD
	CONSTRAINT [CK_Elements_Description_EmptyString] CHECK (([Description] <> ''))
GO
ALTER TABLE
	[dbo].[Elements] CHECK CONSTRAINT [CK_Elements_Description_EmptyString]
GO
ALTER TABLE
	[dbo].[Elements] WITH CHECK
ADD
	CONSTRAINT [CK_Elements_Description_StopLeadingTrailingSpaces] CHECK (
		(
			(('X' + isnull([Description], '')) + 'X') =(('X' + ltrim(rtrim(isnull([Description], '')))) + 'X')
		)
	)
GO
ALTER TABLE
	[dbo].[Elements] CHECK CONSTRAINT [CK_Elements_Description_StopLeadingTrailingSpaces]
GO
ALTER TABLE
	[dbo].[Elements] WITH CHECK
ADD
	CONSTRAINT [CK_Elements_Identifier_EmptyString] CHECK (([Identifier] <> ''))
GO
ALTER TABLE
	[dbo].[Elements] CHECK CONSTRAINT [CK_Elements_Identifier_EmptyString]
GO
ALTER TABLE
	[dbo].[Elements] WITH CHECK
ADD
	CONSTRAINT [CK_Elements_Identifier_StopLeadingTrailingSpaces] CHECK (
		(
			(('X' + isnull([Identifier], '')) + 'X') =(('X' + ltrim(rtrim(isnull([Identifier], '')))) + 'X')
		)
	)
GO
ALTER TABLE
	[dbo].[Elements] CHECK CONSTRAINT [CK_Elements_Identifier_StopLeadingTrailingSpaces]
GO
ALTER TABLE
	[dbo].[ElementTypes] WITH CHECK
ADD
	CONSTRAINT [CK_ElementTypes_Type_EmptyString] CHECK (([Type] <> ''))
GO
ALTER TABLE
	[dbo].[ElementTypes] CHECK CONSTRAINT [CK_ElementTypes_Type_EmptyString]
GO
ALTER TABLE
	[dbo].[ElementTypes] WITH CHECK
ADD
	CONSTRAINT [CK_ElementTypes_Type_StopLeadingTrailingSpaces] CHECK (
		(
			(('X' + isnull([Type], '')) + 'X') =(('X' + ltrim(rtrim(isnull([Type], '')))) + 'X')
		)
	)
GO
ALTER TABLE
	[dbo].[ElementTypes] CHECK CONSTRAINT [CK_ElementTypes_Type_StopLeadingTrailingSpaces]
GO
ALTER TABLE
	[dbo].[Logs] WITH CHECK
ADD
	CONSTRAINT [CK_Logs_Message_EmptyString] CHECK (([Message] <> ''))
GO
ALTER TABLE
	[dbo].[Logs] CHECK CONSTRAINT [CK_Logs_Message_EmptyString]
GO
ALTER TABLE
	[dbo].[Logs] WITH CHECK
ADD
	CONSTRAINT [CK_Logs_Message_StopLeadingTrailingSpaces] CHECK (
		(
			(('X' + isnull([Message], '')) + 'X') =(('X' + ltrim(rtrim(isnull([Message], '')))) + 'X')
		)
	)
GO
ALTER TABLE
	[dbo].[Logs] CHECK CONSTRAINT [CK_Logs_Message_StopLeadingTrailingSpaces]
GO
ALTER TABLE
	[dbo].[Properties] WITH CHECK
ADD
	CONSTRAINT [CK_Properties_Description_StopLeadingTrailingSpaces] CHECK (
		(
			(('X' + isnull([Description], '')) + 'X') =(('X' + ltrim(rtrim(isnull([Description], '')))) + 'X')
		)
	)
GO
ALTER TABLE
	[dbo].[Properties] CHECK CONSTRAINT [CK_Properties_Description_StopLeadingTrailingSpaces]
GO
ALTER TABLE
	[dbo].[Properties] WITH CHECK
ADD
	CONSTRAINT [CK_Properties_Name_EmptyString] CHECK (([Name] <> ''))
GO
ALTER TABLE
	[dbo].[Properties] CHECK CONSTRAINT [CK_Properties_Name_EmptyString]
GO
ALTER TABLE
	[dbo].[Properties] WITH CHECK
ADD
	CONSTRAINT [CK_Properties_Name_StopLeadingTrailingSpaces] CHECK (
		(
			(('X' + isnull([Name], '')) + 'X') =(('X' + ltrim(rtrim(isnull([Name], '')))) + 'X')
		)
	)
GO
ALTER TABLE
	[dbo].[Properties] CHECK CONSTRAINT [CK_Properties_Name_StopLeadingTrailingSpaces]
GO
ALTER TABLE
	[dbo].[Properties] WITH CHECK
ADD
	CONSTRAINT [CK_Properties_Value_StopLeadingTrailingSpaces] CHECK (
		(
			(('X' + isnull([Value], '')) + 'X') =(('X' + ltrim(rtrim(isnull([Value], '')))) + 'X')
		)
	)
GO
ALTER TABLE
	[dbo].[Properties] CHECK CONSTRAINT [CK_Properties_Value_StopLeadingTrailingSpaces]
GO
ALTER TABLE
	[dbo].[PropertyTypes] WITH CHECK
ADD
	CONSTRAINT [CK_PropertyTypes_Type_EmptyString] CHECK (([Type] <> ''))
GO
ALTER TABLE
	[dbo].[PropertyTypes] CHECK CONSTRAINT [CK_PropertyTypes_Type_EmptyString]
GO
ALTER TABLE
	[dbo].[PropertyTypes] WITH CHECK
ADD
	CONSTRAINT [CK_PropertyTypes_Type_StopLeadingTrailingSpaces] CHECK (
		(
			(('X' + isnull([Type], '')) + 'X') =(('X' + ltrim(rtrim(isnull([Type], '')))) + 'X')
		)
	)
GO
ALTER TABLE
	[dbo].[PropertyTypes] CHECK CONSTRAINT [CK_PropertyTypes_Type_StopLeadingTrailingSpaces]
GO
ALTER TABLE
	[dbo].[TestPlans] WITH CHECK
ADD
	CONSTRAINT [CK_TestPlans_Name_EmptyString] CHECK (([Name] <> ''))
GO
ALTER TABLE
	[dbo].[TestPlans] CHECK CONSTRAINT [CK_TestPlans_Name_EmptyString]
GO
ALTER TABLE
	[dbo].[TestPlans] WITH CHECK
ADD
	CONSTRAINT [CK_TestPlans_Name_StopLeadingTrailingSpaces] CHECK (
		(
			(('X' + isnull([Name], '')) + 'X') =(('X' + ltrim(rtrim(isnull([Name], '')))) + 'X')
		)
	)
GO
ALTER TABLE
	[dbo].[TestPlans] CHECK CONSTRAINT [CK_TestPlans_Name_StopLeadingTrailingSpaces]
GO
ALTER TABLE
	[dbo].[TestPlans] WITH CHECK
ADD
	CONSTRAINT [CK_TestPlans_RevisionLabel_StopLeadingTrailingSpaces] CHECK (
		(
			(('X' + isnull([RevisionLabel], '')) + 'X') =(
				('X' + ltrim(rtrim(isnull([RevisionLabel], '')))) + 'X'
			)
		)
	)
GO
ALTER TABLE
	[dbo].[TestPlans] CHECK CONSTRAINT [CK_TestPlans_RevisionLabel_StopLeadingTrailingSpaces]
GO
ALTER TABLE
	[dbo].[TestPlans] WITH CHECK
ADD
	CONSTRAINT [CK_TestPlans_SoftwareVersion_EmptyString] CHECK (([SoftwareVersion] <> ''))
GO
ALTER TABLE
	[dbo].[TestPlans] CHECK CONSTRAINT [CK_TestPlans_SoftwareVersion_EmptyString]
GO
ALTER TABLE
	[dbo].[TestPlans] WITH CHECK
ADD
	CONSTRAINT [CK_TestPlans_SoftwareVersion_StopLeadingTrailingSpaces] CHECK (
		(
			(('X' + isnull([SoftwareVersion], '')) + 'X') =(
				('X' + ltrim(rtrim(isnull([SoftwareVersion], '')))) + 'X'
			)
		)
	)
GO
ALTER TABLE
	[dbo].[TestPlans] CHECK CONSTRAINT [CK_TestPlans_SoftwareVersion_StopLeadingTrailingSpaces]
GO
ALTER TABLE
	[dbo].[Users] WITH CHECK
ADD
	CONSTRAINT [CK_Users_Email_EmptyString] CHECK (([Email] <> ''))
GO
ALTER TABLE
	[dbo].[Users] CHECK CONSTRAINT [CK_Users_Email_EmptyString]
GO
ALTER TABLE
	[dbo].[Users] WITH CHECK
ADD
	CONSTRAINT [CK_Users_EMail_StopLeadingTrailingSpaces] CHECK (
		(
			(('X' + isnull([EMail], '')) + 'X') =(('X' + ltrim(rtrim(isnull([EMail], '')))) + 'X')
		)
	)
GO
ALTER TABLE
	[dbo].[Users] CHECK CONSTRAINT [CK_Users_EMail_StopLeadingTrailingSpaces]
GO
ALTER TABLE
	[dbo].[Users] WITH CHECK
ADD
	CONSTRAINT [CK_Users_Location_EmptyString] CHECK (([Location] <> ''))
GO
ALTER TABLE
	[dbo].[Users] CHECK CONSTRAINT [CK_Users_Location_EmptyString]
GO
ALTER TABLE
	[dbo].[Users] WITH CHECK
ADD
	CONSTRAINT [CK_Users_Location_StopLeadingTrailingSpaces] CHECK (
		(
			(('X' + isnull([Location], '')) + 'X') =(('X' + ltrim(rtrim(isnull([Location], '')))) + 'X')
		)
	)
GO
ALTER TABLE
	[dbo].[Users] CHECK CONSTRAINT [CK_Users_Location_StopLeadingTrailingSpaces]
GO
ALTER TABLE
	[dbo].[Users] WITH CHECK
ADD
	CONSTRAINT [CK_Users_Manager_EmptyString] CHECK (([Manager] <> ''))
GO
ALTER TABLE
	[dbo].[Users] CHECK CONSTRAINT [CK_Users_Manager_EmptyString]
GO
ALTER TABLE
	[dbo].[Users] WITH CHECK
ADD
	CONSTRAINT [CK_Users_Manager_StopLeadingTrailingSpaces] CHECK (
		(
			(('X' + isnull([Manager], '')) + 'X') =(('X' + ltrim(rtrim(isnull([Manager], '')))) + 'X')
		)
	)
GO
ALTER TABLE
	[dbo].[Users] CHECK CONSTRAINT [CK_Users_Manager_StopLeadingTrailingSpaces]
GO
ALTER TABLE
	[dbo].[Users] WITH CHECK
ADD
	CONSTRAINT [CK_Users_Name_EmptyString] CHECK (([Name] <> ''))
GO
ALTER TABLE
	[dbo].[Users] CHECK CONSTRAINT [CK_Users_Name_EmptyString]
GO
ALTER TABLE
	[dbo].[Users] WITH CHECK
ADD
	CONSTRAINT [CK_Users_Name_StopLeadingTrailingSpaces] CHECK (
		(
			(('X' + isnull([Name], '')) + 'X') =(('X' + ltrim(rtrim(isnull([Name], '')))) + 'X')
		)
	)
GO
ALTER TABLE
	[dbo].[Users] CHECK CONSTRAINT [CK_Users_Name_StopLeadingTrailingSpaces]
GO
ALTER TABLE
	[dbo].[Users] WITH CHECK
ADD
	CONSTRAINT [CK_Users_Phone_EmptyString] CHECK (([Phone] <> ''))
GO
ALTER TABLE
	[dbo].[Users] CHECK CONSTRAINT [CK_Users_Phone_EmptyString]
GO
ALTER TABLE
	[dbo].[Users] WITH CHECK
ADD
	CONSTRAINT [CK_Users_Phone_StopLeadingTrailingSpaces] CHECK (
		(
			(('X' + isnull([Phone], '')) + 'X') =(('X' + ltrim(rtrim(isnull([Phone], '')))) + 'X')
		)
	)
GO
ALTER TABLE
	[dbo].[Users] CHECK CONSTRAINT [CK_Users_Phone_StopLeadingTrailingSpaces]
GO
	/****** Object:  StoredProcedure [dbo].[sp_ChangeTestPlanName]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE PROCEDURE [dbo].[sp_ChangeTestPlanName] @userName varchar(150),
	@softwareVersion varchar(50),
	@oldName varchar(255),
	@newName varchar(255),
	@testPlanID int output AS BEGIN --http://technet.microsoft.com/en-us/library/aa175920(v=sql.80).aspx
	Declare @ErrorCode int
Select
	@ErrorCode = @@Error IF LTRIM(RTRIM(@userName)) = '' BEGIN RAISERROR ('Empty user name input field.', 16, 1);

RETURN 1;

END IF LTRIM(RTRIM(@softwareVersion)) = '' BEGIN RAISERROR ('Empty software version input field.', 16, 1);

RETURN 2;

END IF LTRIM(RTRIM(@oldName)) = '' BEGIN RAISERROR ('Empty old test plan name input field.', 16, 1);

RETURN 3;

END IF LTRIM(RTRIM(@newName)) = '' BEGIN RAISERROR ('Empty new test plan name input field.', 16, 1);

RETURN 4;

END DECLARE @theTestPlanID int DECLARE @workingCopyRevision int
SELECT
	@workingCopyRevision = MAX(Revision)
from
	TestPlans
WHERE
	TestPlans.Name = @oldName --Due to constraints, we must modify the working copy revision in order for the update trigger to work
SELECT
	@theTestPlanID = (
		SELECT
			TestPlanID
		from
			TestPlans
		WHERE
			TestPlans.Name = @oldName
			AND TestPlans.Revision = @workingCopyRevision
	)
SET
	@testPlanID = @theTestPlanID --Make sure the software version is compatible
	DECLARE @success bit EXEC @ErrorCode = sp_SoftwareVersionCheck @softwareVersion,
	@theTestPlanID,
	@success = @success OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
		'sp_SoftwareVersionCheck returned an error code.',
		16,
		1
	);

RETURN @ErrorCode
END IF @success <> 1 BEGIN RAISERROR ('Failed Software Version check.', 16, 1);

RETURN 5;

END --Make sure the user has permissions
DECLARE @isUserReadOnly bit EXEC @ErrorCode = sp_IsUserReadOnly @userName,
@isUserReadOnly = @isUserReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_IsUserReadOnly returned an error code.',
	16,
	1
);

RETURN @ErrorCode
END IF @isUserReadOnly is null BEGIN RAISERROR ('User does not exist.', 16, 1);

RETURN 6;

END IF @isUserReadOnly <> 0
OR @isUserReadOnly is null BEGIN RAISERROR ('User does not have permissions.', 16, 1);

RETURN 7;

END ----START TRANSACTION----------------------------
Declare @TransactionCountOnEntry int If @ErrorCode = 0 Begin
Select
	@TransactionCountOnEntry = @@TranCount BEGIN TRANSACTION
End -----------------------------------------------
If @ErrorCode = 0 BEGIN
UPDATE
	TestPlans
SET
	TestPlans.SoftwareVersion = @softwareVersion
WHERE
	TestPlans.TestPlanID = @theTestPlanID
Select
	@ErrorCode = @@Error
END If @ErrorCode = 0 BEGIN
UPDATE
	TestPlans
SET
	TestPlans.Name = @newName
WHERE
	TestPlans.TestPlanID = @theTestPlanID
Select
	@ErrorCode = @@Error
END ----END TRANSACTION----------------------------
If @@TranCount > @TransactionCountOnEntry Begin If @ErrorCode = 0 COMMIT TRANSACTION
Else ROLLBACK TRANSACTION
End -----------------------------------------------
Return @ErrorCode
END
GO
	/****** Object:  StoredProcedure [dbo].[sp_CopyElementRecursive]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE PROCEDURE [dbo].[sp_CopyElementRecursive] @sourceElementID int,
	@targetParentID int,
	@targetTestPlanID int AS BEGIN Declare @localSourceElementID int
SET
	@localSourceElementID = @sourceElementID Declare @localTargetParentID int
SET
	@localTargetParentID = @targetParentID Declare @localTargetTestPlanID int
SET
	@localTargetTestPlanID = @targetTestPlanID --http://technet.microsoft.com/en-us/library/aa175920(v=sql.80).aspx
	Declare @ErrorCode int
Select
	@ErrorCode = @@Error IF @localSourceElementID is null BEGIN RAISERROR ('sourceElementID is null.', 16, 1);

RETURN 1;

END IF @localTargetTestPlanID is null BEGIN RAISERROR ('targetTestPlanID is null.', 16, 1);

RETURN 2;

END --Extract element fields
DECLARE @ELEMENTDATA TABLE (
	ElementTypeID INT,
	Identifier varchar(255),
	Description varchar(2000),
	Sequence smallint,
	ModificationTime bigint,
	UserID INT
)
INSERT INTO
	@ELEMENTDATA
SELECT
	ElementTypeID,
	Identifier,
	Description,
	Sequence,
	ModificationTime,
	UserID
FROM
	Elements
WHERE
	Elements.ElementID = @localSourceElementID DECLARE @typeID int
SELECT
	@typeID = (
		SELECT
			ElementTypeID
		FROM
			@ELEMENTDATA
	) IF @typeID is null BEGIN RAISERROR ('typeID is null.', 16, 1);

RETURN 3;

END DECLARE @sourceIdentifier varchar(255)
SELECT
	@sourceIdentifier = (
		SELECT
			Identifier
		FROM
			@ELEMENTDATA
	) IF @sourceIdentifier is null BEGIN RAISERROR ('sourceIdentifier is null.', 16, 1);

RETURN 4;

END DECLARE @sourceDescription varchar(2000)
SELECT
	@sourceDescription = (
		SELECT
			Description
		FROM
			@ELEMENTDATA
	) IF @sourceDescription is null BEGIN RAISERROR ('sourceDescription is null.', 16, 1);

RETURN 5;

END DECLARE @sourceSequence smallint
SELECT
	@sourceSequence = (
		SELECT
			Sequence
		FROM
			@ELEMENTDATA
	) IF @sourceSequence is null BEGIN RAISERROR ('sourceSequence is null.', 16, 1);

RETURN 6;

END DECLARE @sourceModTime bigint
SELECT
	@sourceModTime = (
		SELECT
			ModificationTime
		FROM
			@ELEMENTDATA
	) IF @sourceModTime is null BEGIN RAISERROR ('sourceModTime is null.', 16, 1);

RETURN 7;

END DECLARE @sourceUserID INT
SELECT
	@sourceUserID = (
		SELECT
			UserID
		FROM
			@ELEMENTDATA
	) IF @sourceUserID is null BEGIN RAISERROR ('sourceUserID is null.', 16, 1);

RETURN 8;

END --Copy parent
DECLARE @newParentElementID int If @ErrorCode = 0 BEGIN
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
		@sourceIdentifier,
		@sourceDescription,
		@sourceSequence,
		@localTargetTestPlanID,
		@typeID,
		@localTargetParentID,
		@sourceModTime,
		@sourceUserID
	)
SELECT
	@newParentElementID = (
		SELECT
			SCOPE_IDENTITY()
	),
	@ErrorCode = @@Error
END --Copy properties
If @ErrorCode = 0 BEGIN
INSERT INTO
	Properties (
		Value,
		Name,
		ElementID,
		PropertyTypeID,
		Description,
		ModificationTime,
		UserID
	)
SELECT
	Value,
	Name,
	@newParentElementID,
	PropertyTypeID,
	Description,
	ModificationTime,
	UserID
FROM
	Properties
WHERE
	Properties.ElementID = @localSourceElementID
Select
	@ErrorCode = @@Error
END --Copy tags
If @ErrorCode = 0 BEGIN
INSERT INTO
	ElementTags (TagID, ElementID)
SELECT
	TagID,
	@newParentElementID
FROM
	ElementTags
WHERE
	ElementTags.ElementID = @localSourceElementID
Select
	@ErrorCode = @@Error
END --Copy children recursively
DECLARE @CHILDREN TABLE (childID INT)
INSERT INTO
	@CHILDREN
SELECT
	Elements.ElementID
FROM
	Elements
WHERE
	Elements.ParentElementID = @localSourceElementID WHILE EXISTS (
		SELECT
			childID
		from
			@CHILDREN
	) BEGIN DECLARE @aChild INT
SET
	@aChild = (
		SELECT
			ElementID AS theChild
		FROM
			Elements
		WHERE
			Elements.ElementID IN (
				SELECT
					TOP 1 *
				FROM
					@CHILDREN
			)
	) --Recursive call
	EXEC @ErrorCode = sp_CopyElementRecursive @aChild,
	@newParentElementID,
	@localTargetTestPlanID IF @ErrorCode <> 0 BEGIN RAISERROR (
		'sp_CopyElementRecursive returned an error code.',
		16,
		1
	);

RETURN @ErrorCode
END DELETE TOP (1)
FROM
	@CHILDREN
END return @ErrorCode
END
GO
	/****** Object:  StoredProcedure [dbo].[sp_CopyMappingRecursive]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE PROCEDURE [dbo].[sp_CopyMappingRecursive] @sourceElementID int,
	@targetTestPlanID int AS BEGIN --http://technet.microsoft.com/en-us/library/aa175920(v=sql.80).aspx
	Declare @ErrorCode int
Select
	@ErrorCode = @@Error IF @sourceElementID is null BEGIN RAISERROR ('sourceElementID is null.', 16, 1);

RETURN 1;

END IF @targetTestPlanID is null BEGIN RAISERROR ('targetTestPlanID is null.', 16, 1);

RETURN 2;

END --Recurse into the children
DECLARE @ID int DECLARE IDs CURSOR LOCAL FOR
SELECT
	Elements.ElementID
FROM
	Elements
WHERE
	Elements.ParentElementID = @sourceElementID OPEN IDs FETCH NEXT
FROM
	IDs into @ID WHILE @@FETCH_STATUS = 0 BEGIN --Recursive call
	EXEC @ErrorCode = sp_CopyMappingRecursive @ID,
	@targetTestPlanID IF @ErrorCode <> 0 BEGIN RAISERROR (
		'sp_CopyMappingRecursive returned an error code.',
		16,
		1
	);

RETURN @ErrorCode
END FETCH NEXT
FROM
	IDs into @ID
END CLOSE IDs DEALLOCATE IDs --Determine element type
DECLARE @theElementType varchar(MAX)
SET
	@theElementType = (
		SELECT
			Type
		FROM
			ElementTypes
			INNER JOIN Elements ON ElementTypes.ElementTypeID = Elements.ElementTypeID
		WHERE
			Elements.ElementID = @sourceElementID
	) IF @theElementType is null BEGIN RAISERROR ('theElementType is null.', 16, 1);

RETURN 3;

END --CoverageMapping
IF 'FailureMode' = @theElementType
OR 'Evaluation' = @theElementType BEGIN DECLARE @coverageMappingID int DECLARE coverageMappingIDs CURSOR LOCAL FOR
SELECT
	CoverageMapping.CoverageMappingID
FROM
	CoverageMapping
WHERE
	CoverageMapping.FailureModeID = @sourceElementID
	OR CoverageMapping.EvaluationID = @sourceElementID OPEN coverageMappingIDs FETCH NEXT
FROM
	coverageMappingIDs into @coverageMappingID WHILE @@FETCH_STATUS = 0 BEGIN DECLARE @oldFailureModeID int
SELECT
	@oldFailureModeID = (
		SELECT
			FailureModeID
		FROM
			CoverageMapping
		WHERE
			CoverageMappingID = @coverageMappingID
	) DECLARE @failureModeIdentifier varchar(255)
SELECT
	@failureModeIdentifier = (
		SELECT
			Identifier
		FROM
			Elements
		WHERE
			Elements.ElementID = @oldFailureModeID
	) DECLARE @oldEvaluationID int
SELECT
	@oldEvaluationID = (
		SELECT
			EvaluationID
		FROM
			CoverageMapping
		WHERE
			CoverageMappingID = @coverageMappingID
	) DECLARE @evaluationIdentifier varchar(255)
SELECT
	@evaluationIdentifier = (
		SELECT
			Identifier
		FROM
			Elements
		WHERE
			Elements.ElementID = @oldEvaluationID
	) DECLARE @newEvaluationID int
SELECT
	@newEvaluationID = (
		SELECT
			ElementID
		FROM
			Elements
		WHERE
			Identifier = @evaluationIdentifier
			AND TestPlanID = @targetTestPlanID
	) DECLARE @newFailureModeID int
SELECT
	@newFailureModeID = (
		SELECT
			ElementID
		FROM
			Elements
		WHERE
			Identifier = @failureModeIdentifier
			AND TestPlanID = @targetTestPlanID
	) IF NOT EXISTS(
		SELECT
			CoverageMappingID
		FROM
			CoverageMapping
		WHERE
			FailureModeID = @newFailureModeID
			AND EvaluationID = @newEvaluationID
	) BEGIN If @ErrorCode = 0 BEGIN
INSERT INTO
	CoverageMapping (FailureModeID, EvaluationID)
Values
	(@newFailureModeID, @newEvaluationID)
Select
	@ErrorCode = @@Error
END
END FETCH NEXT
FROM
	coverageMappingIDs into @coverageMappingID
END CLOSE coverageMappingIDs DEALLOCATE coverageMappingIDs
END --FixtureMapping
IF 'Fixture' = @theElementType
OR 'Station' = @theElementType BEGIN DECLARE @fixtureMappingID int DECLARE fixtureMappingIDs CURSOR LOCAL FOR
SELECT
	FixtureMapping.FixtureMappingID
FROM
	FixtureMapping
WHERE
	FixtureMapping.TestStationID = @sourceElementID
	OR FixtureMapping.TestFixtureID = @sourceElementID OPEN fixtureMappingIDs FETCH NEXT
FROM
	fixtureMappingIDs into @fixtureMappingID WHILE @@FETCH_STATUS = 0 BEGIN DECLARE @oldTestStationID int
SELECT
	@oldTestStationID = (
		SELECT
			TestStationID
		FROM
			FixtureMapping
		WHERE
			FixtureMappingID = @fixtureMappingID
	) DECLARE @testStationIdentifier varchar(255)
SELECT
	@testStationIdentifier = (
		SELECT
			Identifier
		FROM
			Elements
		WHERE
			Elements.ElementID = @oldTestStationID
	) DECLARE @oldTestFixtureID int
SELECT
	@oldTestFixtureID = (
		SELECT
			TestFixtureID
		FROM
			FixtureMapping
		WHERE
			FixtureMappingID = @fixtureMappingID
	) DECLARE @testFixtureIdentifier varchar(255)
SELECT
	@testFixtureIdentifier = (
		SELECT
			Identifier
		FROM
			Elements
		WHERE
			Elements.ElementID = @oldTestFixtureID
	) DECLARE @newTestFixtureID int
SELECT
	@newTestFixtureID = (
		SELECT
			ElementID
		FROM
			Elements
		WHERE
			Identifier = @testFixtureIdentifier
			AND TestPlanID = @targetTestPlanID
	) DECLARE @newTestStationID int
SELECT
	@newTestStationID = (
		SELECT
			ElementID
		FROM
			Elements
		WHERE
			Identifier = @testStationIdentifier
			AND TestPlanID = @targetTestPlanID
	) IF NOT EXISTS(
		SELECT
			FixtureMappingID
		FROM
			FixtureMapping
		WHERE
			TestStationID = @newTestStationID
			AND TestFixtureID = @newTestFixtureID
	) BEGIN If @ErrorCode = 0 BEGIN
INSERT INTO
	FixtureMapping (TestStationID, TestFixtureID)
Values
	(@newTestStationID, @newTestFixtureID)
Select
	@ErrorCode = @@Error
END
END FETCH NEXT
FROM
	fixtureMappingIDs into @fixtureMappingID
END CLOSE fixtureMappingIDs DEALLOCATE fixtureMappingIDs
END --TesterMapping
IF 'Tester' = @theElementType
OR 'Station' = @theElementType BEGIN DECLARE @testerMappingID int DECLARE testerMappingIDs CURSOR LOCAL FOR
SELECT
	TesterMapping.TesterMappingID
FROM
	TesterMapping
WHERE
	TesterMapping.TestStationID = @sourceElementID
	OR TesterMapping.TesterID = @sourceElementID OPEN testerMappingIDs FETCH NEXT
FROM
	testerMappingIDs into @testerMappingID WHILE @@FETCH_STATUS = 0 BEGIN DECLARE @oldTestStationID2 int
SELECT
	@oldTestStationID2 = (
		SELECT
			TestStationID
		FROM
			TesterMapping
		WHERE
			TesterMappingID = @testerMappingID
	) DECLARE @testStationIdentifier2 varchar(255)
SELECT
	@testStationIdentifier2 = (
		SELECT
			Identifier
		FROM
			Elements
		WHERE
			Elements.ElementID = @oldTestStationID2
	) DECLARE @oldTesterID int
SELECT
	@oldTesterID = (
		SELECT
			TesterID
		FROM
			TesterMapping
		WHERE
			TesterMappingID = @testerMappingID
	) DECLARE @testerIdentifier varchar(255)
SELECT
	@testerIdentifier = (
		SELECT
			Identifier
		FROM
			Elements
		WHERE
			Elements.ElementID = @oldTesterID
	) DECLARE @newTesterID int
SELECT
	@newTesterID = (
		SELECT
			ElementID
		FROM
			Elements
		WHERE
			Identifier = @testerIdentifier
			AND TestPlanID = @targetTestPlanID
	) DECLARE @newTestStationID2 int
SELECT
	@newTestStationID2 = (
		SELECT
			ElementID
		FROM
			Elements
		WHERE
			Identifier = @testStationIdentifier2
			AND TestPlanID = @targetTestPlanID
	) IF NOT EXISTS(
		SELECT
			TesterMappingID
		FROM
			TesterMapping
		WHERE
			TestStationID = @newTestStationID2
			AND TesterID = @newTesterID
	) BEGIN If @ErrorCode = 0 BEGIN
INSERT INTO
	TesterMapping (TestStationID, TesterID)
Values
	(@newTestStationID2, @newTesterID)
Select
	@ErrorCode = @@Error
END
END FETCH NEXT
FROM
	testerMappingIDs into @testerMappingID
END CLOSE testerMappingIDs DEALLOCATE testerMappingIDs
END Return @ErrorCode
END
GO
	/****** Object:  StoredProcedure [dbo].[sp_CopyTestPlan]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE PROCEDURE [dbo].[sp_CopyTestPlan] @userName varchar(150),
	@softwareVersion varchar(50),
	@destinationName varchar(255),
	@sourceName varchar(255),
	@sourceRevision int,
	@newTestPlanID int output AS BEGIN --http://technet.microsoft.com/en-us/library/aa175920(v=sql.80).aspx
	Declare @ErrorCode int
Select
	@ErrorCode = @@Error IF LTRIM(RTRIM(@userName)) = '' BEGIN RAISERROR ('Empty user name input field.', 16, 1);

RETURN 1;

END IF LTRIM(RTRIM(@softwareVersion)) = '' BEGIN RAISERROR ('Empty software version input field.', 16, 1);

RETURN 2;

END IF LTRIM(RTRIM(@destinationName)) = '' BEGIN RAISERROR (
	'Empty test plan destination name input field.',
	16,
	1
);

RETURN 3;

END IF LTRIM(RTRIM(@sourceName)) = '' BEGIN RAISERROR (
	'Empty test plan source name input field.',
	16,
	1
);

RETURN 4;

END --Make sure the user exists and has permissions
DECLARE @theUserID int
SET
	@theUserID = (
		SELECT
			UserID
		FROM
			Users
		WHERE
			Name = @userName
	) IF @theUserID is null BEGIN RAISERROR ('User does not exist.', 16, 1);

RETURN 5;

END DECLARE @isUserReadOnly bit EXEC @ErrorCode = sp_IsUserReadOnly @userName,
@isUserReadOnly = @isUserReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_IsUserReadOnly returned an error code.',
	16,
	1
);

RETURN @ErrorCode
END IF @isUserReadOnly is null BEGIN RAISERROR ('User does not exist.', 16, 1);

RETURN 6;

END IF @isUserReadOnly <> 0
OR @isUserReadOnly is null BEGIN RAISERROR ('User does not have permissions.', 16, 1);

RETURN 7;

END --Make sure the destination name doesn't already exist
DECLARE @destinationTestPlanID int
SELECT
	@destinationTestPlanID = (
		SELECT
			TestPlanID
		from
			TestPlans
		WHERE
			TestPlans.Name = @destinationName
	) IF @destinationTestPlanID is not null BEGIN RAISERROR (
		'Test Plan already exists with the specified destination name.',
		16,
		1
	);

RETURN 8;

END --The source test plan
DECLARE @sourceTestPlanID int
SELECT
	@sourceTestPlanID = (
		SELECT
			TestPlanID
		from
			TestPlans
		WHERE
			TestPlans.Name = @sourceName
			AND TestPlans.Revision = @sourceRevision
	) IF @sourceTestPlanID is null BEGIN RAISERROR (
		'Test Plan does not exist at the specified source name or revision.',
		16,
		1
	);

RETURN 9;

END --The source root element
DECLARE @sourceRootElementID int
SELECT
	@sourceRootElementID = (
		SELECT
			ElementID
		from
			Elements
		WHERE
			Elements.Identifier = 'testplan'
			AND Elements.TestPlanID = @sourceTestPlanID
	) IF @sourceRootElementID is null BEGIN RAISERROR ('sourceRootElementID is null.', 16, 1);

RETURN 10;

END --Make sure the software version is compatible
DECLARE @success bit EXEC @ErrorCode = sp_SoftwareVersionCheck @softwareVersion,
@sourceTestPlanID,
@success = @success OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_SoftwareVersionCheck returned an error code.',
	16,
	1
);

RETURN @ErrorCode
END IF @success <> 1 BEGIN RAISERROR ('Failed Software Version check.', 16, 1);

RETURN 11;

END -------------------------------------------------------------------------------------------------
--ALTER TABLE Elements DISABLE TRIGGER Elements_Modify_Constraints
--ALTER TABLE Properties DISABLE TRIGGER Properties_Modify_Constraints
--ALTER TABLE ElementTags DISABLE TRIGGER ElementTags_Insert_Constraints
SET
	Context_Info 0x55555 -------------------------------------------------------------------------------------------------
	DECLARE @modTime BIGINT
SELECT
	@modTime = (
		SELECT
			DATEDIFF(ss, '1/1/1970 00:00:00', GETUTCDATE())
	) ----START TRANSACTION----------------------------
	Declare @TransactionCountOnEntry int If @ErrorCode = 0 Begin
Select
	@TransactionCountOnEntry = @@TranCount BEGIN TRANSACTION
End -----------------------------------------------
--Create a new destination test plan
If @ErrorCode = 0 BEGIN
INSERT INTO
	TestPlans (Revision, Name, RevisionLabel, SoftwareVersion)
VALUES
	(1, @destinationName, '', @softwareVersion)
SELECT
	@newTestPlanID = (
		SELECT
			SCOPE_IDENTITY()
	),
	@ErrorCode = @@Error
END --Recursively copy the elements and their properties and tags
If @ErrorCode = 0 BEGIN EXEC @ErrorCode = sp_CopyElementRecursive @sourceRootElementID,
NULL,
@newTestPlanID
END IF @ErrorCode <> 0 BEGIN
SET
	Context_Info 0x0 RAISERROR (
		'sp_CopyElementRecursive returned an error code.',
		16,
		1
	);

ROLLBACK TRANSACTION Return @ErrorCode;

END --Recursively copy the mappings
If @ErrorCode = 0 BEGIN EXEC @ErrorCode = sp_CopyMappingRecursive @sourceRootElementID,
@newTestPlanID
END IF @ErrorCode <> 0 BEGIN
SET
	Context_Info 0x0 RAISERROR (
		'sp_CopyMappingRecursive returned an error code.',
		16,
		1
	);

ROLLBACK TRANSACTION Return @ErrorCode;

END --The new root element
DECLARE @newRootElementID int
SELECT
	@newRootElementID = (
		SELECT
			ElementID
		from
			Elements
		WHERE
			Elements.Identifier = 'testplan'
			AND Elements.TestPlanID = @newTestPlanID
	) IF @newRootElementID is null BEGIN
SET
	Context_Info 0x0 RAISERROR ('newRootElementID is null.', 16, 1);

ROLLBACK TRANSACTION Return 12;

END --Set the userID and modTime on the new root element
If @ErrorCode = 0 BEGIN
UPDATE
	Elements
SET
	Elements.ModificationTime = @modTime,
	Elements.UserID = @theUserID
WHERE
	Elements.ElementID = @newRootElementID
Select
	@ErrorCode = @@Error
END ----END TRANSACTION----------------------------
If @@TranCount > @TransactionCountOnEntry Begin If @ErrorCode = 0 COMMIT TRANSACTION
Else ROLLBACK TRANSACTION
End -----------------------------------------------
-------------------------------------------------------------------------------------------------
--ALTER TABLE Elements ENABLE TRIGGER Elements_Modify_Constraints
--ALTER TABLE Properties ENABLE TRIGGER Properties_Modify_Constraints
--ALTER TABLE ElementTags ENABLE TRIGGER ElementTags_Insert_Constraints
SET
	Context_Info 0x0 -------------------------------------------------------------------------------------------------
	Return @ErrorCode
END
GO
	/****** Object:  StoredProcedure [dbo].[sp_CreateOrUpdateUser]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE PROCEDURE [dbo].[sp_CreateOrUpdateUser] @name varchar(150),
	@phone varchar(50),
	@email varchar(150),
	@manager varchar(150),
	@location varchar(150),
	@userID int output AS BEGIN --http://technet.microsoft.com/en-us/library/aa175920(v=sql.80).aspx
	Declare @ErrorCode int
Select
	@ErrorCode = @@Error IF LTRIM(RTRIM(@name)) = '' BEGIN RAISERROR ('Empty user name input field.', 16, 1);

RETURN 1;

END IF LTRIM(RTRIM(@phone)) = '' BEGIN RAISERROR ('Empty user phone input field.', 16, 1);

RETURN 2;

END IF LTRIM(RTRIM(@email)) = '' BEGIN RAISERROR ('Empty user email input field.', 16, 1);

RETURN 3;

END IF LTRIM(RTRIM(@manager)) = '' BEGIN RAISERROR ('Empty user manager input field.', 16, 1);

RETURN 4;

END IF LTRIM(RTRIM(@location)) = '' BEGIN RAISERROR ('Empty user location input field.', 16, 1);

RETURN 5;

END
SELECT
	@userID = (
		SELECT
			UserID
		FROM
			Users
		WHERE
			Name = @name
	) ----START TRANSACTION----------------------------
	Declare @TransactionCountOnEntry int If @ErrorCode = 0 Begin
Select
	@TransactionCountOnEntry = @@TranCount BEGIN TRANSACTION
End -----------------------------------------------
IF @userID is null BEGIN If @ErrorCode = 0 BEGIN
INSERT INTO
	Users (Name, Phone, Email, Manager, Location)
VALUES
	(@name, @phone, @email, @manager, @location)
SELECT
	@userID = (
		SELECT
			SCOPE_IDENTITY()
	),
	@ErrorCode = @@Error
END
END
ELSE BEGIN If @ErrorCode = 0 BEGIN
UPDATE
	Users
SET
	Phone = @phone,
	Email = @email,
	Manager = @manager,
	Location = @location
WHERE
	Name = @name
Select
	@ErrorCode = @@Error
END
END ----END TRANSACTION----------------------------
If @@TranCount > @TransactionCountOnEntry Begin If @ErrorCode = 0 COMMIT TRANSACTION
Else ROLLBACK TRANSACTION
End -----------------------------------------------
Return @ErrorCode
END
GO
	/****** Object:  StoredProcedure [dbo].[sp_DeleteElement]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE PROCEDURE [dbo].[sp_DeleteElement] @userName varchar(150),
	@softwareVersion varchar(50),
	@identifier varchar(255),
	@testPlanName varchar(255),
	@testPlanRevision int AS BEGIN --http://technet.microsoft.com/en-us/library/aa175920(v=sql.80).aspx
	Declare @ErrorCode int
Select
	@ErrorCode = @@Error IF LTRIM(RTRIM(@userName)) = '' BEGIN RAISERROR ('Empty user name input field.', 16, 1);

RETURN 1;

END IF LTRIM(RTRIM(@softwareVersion)) = '' BEGIN RAISERROR ('Empty software version input field.', 16, 1);

RETURN 2;

END IF LTRIM(RTRIM(@identifier)) = '' BEGIN RAISERROR ('Empty identifier input field.', 16, 1);

RETURN 3;

END IF LTRIM(RTRIM(@testPlanName)) = '' BEGIN RAISERROR ('Empty test plan name input field.', 16, 1);

RETURN 4;

END DECLARE @theTestPlanID int
SELECT
	@theTestPlanID = (
		SELECT
			TestPlanID
		from
			TestPlans
		WHERE
			TestPlans.Name = @testPlanName
			AND TestPlans.Revision = @testPlanRevision
	) IF @theTestPlanID is null BEGIN RAISERROR (
		'Test Plan does not exist with the specified name and revision.',
		16,
		1
	);

RETURN 5;

END DECLARE @theElementID int
SELECT
	@theElementID = (
		SELECT
			ElementID
		from
			Elements
		WHERE
			Elements.Identifier = @identifier
			AND Elements.TestPlanID = @theTestPlanID
	) IF @theElementID is null BEGIN RAISERROR (
		'Element does not exist in the Test Plan with the specified identifier.',
		16,
		1
	);

RETURN 6;

END DECLARE @isReadOnly int EXEC @ErrorCode = sp_IsTestPlanReadOnly @testPlanName,
@testPlanRevision,
@isReadOnly = @isReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_IsTestPlanReadOnly returned an error code.',
	16,
	1
);

RETURN @ErrorCode
END IF 1 = @isReadOnly Begin RAISERROR (
	'Can only modify Elements in the working copy.',
	16,
	1
);

RETURN 7;

End --Make sure the software version is compatible
DECLARE @success bit EXEC @ErrorCode = sp_SoftwareVersionCheck @softwareVersion,
@theTestPlanID,
@success = @success OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_SoftwareVersionCheck returned an error code.',
	16,
	1
);

RETURN @ErrorCode
END IF @success <> 1 BEGIN RAISERROR ('Failed Software Version check.', 16, 1);

RETURN 8;

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

RETURN 9;

END --Make sure the user exists and has permissions
DECLARE @isUserReadOnly bit EXEC @ErrorCode = sp_IsUserReadOnly @userName,
@isUserReadOnly = @isUserReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_IsUserReadOnly returned an error code.',
	16,
	1
);

RETURN @ErrorCode
END IF @isUserReadOnly is null BEGIN RAISERROR ('User does not exist.', 16, 1);

RETURN 10;

END IF @isUserReadOnly <> 0
OR @isUserReadOnly is null BEGIN RAISERROR ('User does not have permissions.', 16, 1);

RETURN 11;

END DECLARE @theElementType varchar(MAX)
SET
	@theElementType = (
		SELECT
			Type
		FROM
			ElementTypes
			INNER JOIN Elements ON ElementTypes.ElementTypeID = Elements.ElementTypeID
		WHERE
			Elements.ElementID = @theElementID
	) --You can't delete root elements
	IF 'TestPlan' = @theElementType
	OR 'Requirements' = @theElementType
	OR 'Tests' = @theElementType
	OR 'Fixturing' = @theElementType
	OR 'Flow' = @theElementType BEGIN RAISERROR ('You cannot delete root elements.', 16, 1);

RETURN 12;

END DECLARE @modTime BIGINT
SELECT
	@modTime = (
		SELECT
			DATEDIFF(ss, '1/1/1970 00:00:00', GETUTCDATE())
	) -------------------------------------------------------------------------------------------------
	--ALTER TABLE Elements DISABLE TRIGGER Elements_Modify_Constraints
SET
	Context_Info 0x55555 -------------------------------------------------------------------------------------------------
	----START TRANSACTION----------------------------
	Declare @TransactionCountOnEntry int If @ErrorCode = 0 Begin
Select
	@TransactionCountOnEntry = @@TranCount BEGIN TRANSACTION
End -----------------------------------------------
EXEC @ErrorCode = sp_DeleteElementRecursive @theElementID,
@theUserID,
@modTime IF @ErrorCode <> 0 BEGIN
SET
	Context_Info 0x0 RAISERROR (
		'sp_DeleteElementRecursive returned an error code.',
		16,
		1
	);

RETURN @ErrorCode
END If @ErrorCode = 0 Begin
UPDATE
	TestPlans
SET
	TestPlans.SoftwareVersion = @softwareVersion
WHERE
	TestPlans.TestPlanID = @theTestPlanID
Select
	@ErrorCode = @@Error
End ----END TRANSACTION----------------------------
If @@TranCount > @TransactionCountOnEntry Begin If @ErrorCode = 0 COMMIT TRANSACTION
Else ROLLBACK TRANSACTION
End -----------------------------------------------
-------------------------------------------------------------------------------------------------
--ALTER TABLE Elements ENABLE TRIGGER Elements_Modify_Constraints
SET
	Context_Info 0x0 -------------------------------------------------------------------------------------------------
	Return @ErrorCode
END
GO
	/****** Object:  StoredProcedure [dbo].[sp_DeleteElementRecursive]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE PROCEDURE [dbo].[sp_DeleteElementRecursive] @elementID int,
	@userID int,
	@modTime BIGINT AS BEGIN --http://technet.microsoft.com/en-us/library/aa175920(v=sql.80).aspx
	Declare @ErrorCode int
Select
	@ErrorCode = @@Error IF @elementID is null BEGIN RAISERROR ('Element ID is null.', 16, 1);

RETURN 1;

END IF @userID is null BEGIN RAISERROR ('User ID is null.', 16, 1);

RETURN 2;

END IF @modTime is null BEGIN RAISERROR ('Mod time is null.', 16, 1);

RETURN 3;

END DECLARE @ID int DECLARE IDs CURSOR LOCAL FOR
SELECT
	Elements.ElementID
FROM
	Elements
WHERE
	Elements.ParentElementID = @elementID OPEN IDs FETCH NEXT
FROM
	IDs into @ID WHILE @@FETCH_STATUS = 0 BEGIN --Recursive call
	EXEC @ErrorCode = sp_DeleteElementRecursive @ID,
	@userID,
	@modTime IF @ErrorCode <> 0 BEGIN RAISERROR (
		'sp_DeleteElementRecursive returned an error code.',
		16,
		1
	);

RETURN @ErrorCode
END FETCH NEXT
FROM
	IDs into @ID
END CLOSE IDs DEALLOCATE IDs DECLARE @theElementParentID int
SELECT
	@theElementParentID = (
		SELECT
			ParentElementID
		FROM
			Elements
		WHERE
			ElementID = @elementID
	) IF @theElementParentID is null BEGIN RAISERROR ('Parent element ID is null.', 16, 1);

RETURN 4;

END DECLARE @currentSequence smallint
SELECT
	@currentSequence = (
		SELECT
			Sequence
		FROM
			Elements
		WHERE
			ElementID = @elementID
	) IF @currentSequence is null BEGIN RAISERROR ('Current sequence is null.', 16, 1);

RETURN 5;

END DECLARE @maxSequenceCurrent smallint
SELECT
	@maxSequenceCurrent = (
		SELECT
			Max(Sequence)
		FROM
			Elements
		WHERE
			Elements.ParentElementID = @theElementParentID
	) IF @maxSequenceCurrent is null BEGIN RAISERROR ('Max sequence is null.', 16, 1);

RETURN 6;

END --Remove mapping
If @ErrorCode = 0 Begin
DELETE FROM
	CoverageMapping
WHERE
	FailureModeID = @elementID
	OR EvaluationID = @elementID
Select
	@ErrorCode = @@Error
End If @ErrorCode = 0 Begin
DELETE FROM
	FixtureMapping
WHERE
	TestStationID = @elementID
	OR TestFixtureID = @elementID
Select
	@ErrorCode = @@Error
End If @ErrorCode = 0 Begin
DELETE FROM
	TesterMapping
WHERE
	TesterID = @elementID
	OR TestStationID = @elementID
Select
	@ErrorCode = @@Error
End --Remove element (tags and properties have cascading deletes)
If @ErrorCode = 0 Begin
DELETE FROM
	Elements
WHERE
	Elements.ElementID = @elementID
Select
	@ErrorCode = @@Error
End IF @maxSequenceCurrent <> 1 BEGIN If @ErrorCode = 0 Begin
UPDATE
	Elements
set
	Elements.ModificationTime = @modTime
where
	Sequence between @currentSequence + 1
	and @maxSequenceCurrent
	AND Elements.ParentElementID = @theElementParentID
Select
	@ErrorCode = @@Error
End If @ErrorCode = 0 Begin
UPDATE
	Elements
set
	Elements.UserID = @userID
where
	Sequence between @currentSequence + 1
	and @maxSequenceCurrent
	AND Elements.ParentElementID = @theElementParentID
Select
	@ErrorCode = @@Error
End --re-sequence the former siblings to take up the space left by the child that was deleted
If @ErrorCode = 0 Begin
UPDATE
	Elements
set
	Sequence = Sequence - 1
where
	Sequence between @currentSequence + 1
	and @maxSequenceCurrent
	AND Elements.ParentElementID = @theElementParentID
Select
	@ErrorCode = @@Error
End
END Return @ErrorCode
END
GO
	/****** Object:  StoredProcedure [dbo].[sp_DeleteMapping]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE PROCEDURE [dbo].[sp_DeleteMapping] @userName varchar(150),
	@softwareVersion varchar(50),
	@identifier1 varchar(255),
	@identifier2 varchar(255),
	@testPlanName varchar(255),
	@testPlanRevision int AS BEGIN --http://technet.microsoft.com/en-us/library/aa175920(v=sql.80).aspx
	Declare @ErrorCode int
Select
	@ErrorCode = @@Error IF LTRIM(RTRIM(@userName)) = '' BEGIN RAISERROR ('Empty user name input field.', 16, 1);

RETURN 1;

END IF LTRIM(RTRIM(@softwareVersion)) = '' BEGIN RAISERROR ('Empty software version input field.', 16, 1);

RETURN 2;

END IF LTRIM(RTRIM(@identifier1)) = '' BEGIN RAISERROR ('Empty identifier1 input field.', 16, 1);

RETURN 3;

END IF LTRIM(RTRIM(@identifier2)) = '' BEGIN RAISERROR ('Empty identifier2 input field.', 16, 1);

RETURN 4;

END IF LTRIM(RTRIM(@testPlanName)) = '' BEGIN RAISERROR ('Empty test plan name input field.', 16, 1);

RETURN 5;

END DECLARE @theTestPlanID int
SELECT
	@theTestPlanID = (
		SELECT
			TestPlanID
		from
			TestPlans
		WHERE
			TestPlans.Name = @testPlanName
			AND TestPlans.Revision = @testPlanRevision
	) IF @theTestPlanID is null BEGIN RAISERROR (
		'Test Plan does not exist with the specified name and revision.',
		16,
		1
	);

RETURN 6;

END DECLARE @isReadOnly int EXEC @ErrorCode = sp_IsTestPlanReadOnly @testPlanName,
@testPlanRevision,
@isReadOnly = @isReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_IsTestPlanReadOnly returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF 1 = @isReadOnly Begin RAISERROR (
	'Can only delete mappings in the working copy.',
	16,
	1
);

RETURN 7;

End --Make sure the software version is compatible
DECLARE @success bit EXEC @ErrorCode = sp_SoftwareVersionCheck @softwareVersion,
@theTestPlanID,
@success = @success OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_SoftwareVersionCheck returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF @success <> 1 BEGIN RAISERROR ('Failed Software Version check.', 16, 1);

RETURN 8;

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

RETURN 9;

END --Make sure the user exists and has permissions
DECLARE @isUserReadOnly bit EXEC @ErrorCode = sp_IsUserReadOnly @userName,
@isUserReadOnly = @isUserReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_IsUserReadOnly returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF @isUserReadOnly is null BEGIN RAISERROR ('User does not exist.', 16, 1);

RETURN 10;

END IF @isUserReadOnly <> 0
OR @isUserReadOnly is null BEGIN RAISERROR ('User does not have permissions.', 16, 1);

RETURN 11;

END DECLARE @elementID1 int
SELECT
	@elementID1 = (
		SELECT
			ElementID
		FROM
			Elements
		WHERE
			Identifier = @identifier1
			AND TestPlanID = @theTestPlanID
	) IF @elementID1 is null BEGIN RAISERROR (
		'Element1 does not exist with the specified identifier.',
		16,
		1
	);

RETURN 12;

END DECLARE @elementID2 int
SELECT
	@elementID2 = (
		SELECT
			ElementID
		FROM
			Elements
		WHERE
			Identifier = @identifier2
			AND TestPlanID = @theTestPlanID
	) IF @elementID2 is null BEGIN RAISERROR (
		'Element2 does not exist with the specified identifier.',
		16,
		1
	);

RETURN 13;

END IF @identifier1 = @identifier2 BEGIN RAISERROR ('Identifiers cannot be the same.', 16, 1);

RETURN 14;

END DECLARE @elementType1 varchar(MAX)
SET
	@elementType1 = (
		SELECT
			Type
		FROM
			ElementTypes
			INNER JOIN Elements ON ElementTypes.ElementTypeID = Elements.ElementTypeID
		WHERE
			Elements.ElementID = @elementID1
	) DECLARE @elementType2 varchar(MAX)
SET
	@elementType2 = (
		SELECT
			Type
		FROM
			ElementTypes
			INNER JOIN Elements ON ElementTypes.ElementTypeID = Elements.ElementTypeID
		WHERE
			Elements.ElementID = @elementID2
	) DECLARE @modTime BIGINT
SELECT
	@modTime = (
		SELECT
			DATEDIFF(ss, '1/1/1970 00:00:00', GETUTCDATE())
	) ----START TRANSACTION----------------------------
	Declare @TransactionCountOnEntry int If @ErrorCode = 0 Begin
Select
	@TransactionCountOnEntry = @@TranCount BEGIN TRANSACTION
End -----------------------------------------------
--Delete the mapping
DECLARE @existingMappingID int IF @elementType1 = 'FailureMode' BEGIN IF @elementType2 <> 'Evaluation' BEGIN RAISERROR ('Element types are incompatible.', 16, 1);

ROLLBACK TRANSACTION RETURN 15;

END
ELSE BEGIN
SELECT
	@existingMappingID = (
		SELECT
			CoverageMappingID
		FROM
			CoverageMapping
		WHERE
			CoverageMapping.FailureModeID = @elementID1
			AND CoverageMapping.EvaluationID = @elementID2
	) IF @existingMappingID is null BEGIN RAISERROR ('Mapping does not exist.', 16, 1);

ROLLBACK TRANSACTION RETURN 16
END If @ErrorCode = 0 BEGIN
DELETE FROM
	CoverageMapping
WHERE
	CoverageMappingID = @existingMappingID
Select
	@ErrorCode = @@Error
END
END
END
ELSE IF @elementType1 = 'Evaluation' BEGIN IF @elementType2 <> 'FailureMode' BEGIN RAISERROR ('Element types are incompatible.', 16, 1);

ROLLBACK TRANSACTION RETURN 17;

END
ELSE BEGIN
SELECT
	@existingMappingID = (
		SELECT
			CoverageMappingID
		FROM
			CoverageMapping
		WHERE
			CoverageMapping.FailureModeID = @elementID2
			AND CoverageMapping.EvaluationID = @elementID1
	) IF @existingMappingID is null BEGIN RAISERROR ('Mapping does not exist.', 16, 1);

ROLLBACK TRANSACTION RETURN 18
END If @ErrorCode = 0 BEGIN
DELETE FROM
	CoverageMapping
WHERE
	CoverageMappingID = @existingMappingID
Select
	@ErrorCode = @@Error
END
END
END
ELSE IF @elementType1 = 'Station'
AND @elementType2 <> 'Tester' BEGIN IF @elementType2 <> 'Fixture' BEGIN RAISERROR ('Element types are incompatible.', 16, 1);

ROLLBACK TRANSACTION RETURN 19;

END
ELSE BEGIN
SELECT
	@existingMappingID = (
		SELECT
			FixtureMappingID
		FROM
			FixtureMapping
		WHERE
			FixtureMapping.TestStationID = @elementID1
			AND FixtureMapping.TestFixtureID = @elementID2
	) IF @existingMappingID is null BEGIN RAISERROR ('Mapping does not exist.', 16, 1);

ROLLBACK TRANSACTION RETURN 20
END If @ErrorCode = 0 BEGIN
DELETE FROM
	FixtureMapping
WHERE
	FixtureMappingID = @existingMappingID
Select
	@ErrorCode = @@Error
END
END
END
ELSE IF @elementType1 = 'Fixture' BEGIN IF @elementType2 <> 'Station' BEGIN RAISERROR ('Element types are incompatible.', 16, 1);

ROLLBACK TRANSACTION RETURN 21;

END
ELSE BEGIN
SELECT
	@existingMappingID = (
		SELECT
			FixtureMappingID
		FROM
			FixtureMapping
		WHERE
			FixtureMapping.TestStationID = @elementID2
			AND FixtureMapping.TestFixtureID = @elementID1
	) IF @existingMappingID is null BEGIN RAISERROR ('Mapping does not exist.', 16, 1);

ROLLBACK TRANSACTION RETURN 22
END If @ErrorCode = 0 BEGIN
DELETE FROM
	FixtureMapping
WHERE
	FixtureMappingID = @existingMappingID
Select
	@ErrorCode = @@Error
END
END
END
ELSE IF @elementType1 = 'Station'
AND @elementType2 <> 'Fixture' BEGIN IF @elementType2 <> 'Tester' BEGIN RAISERROR ('Element types are incompatible.', 16, 1);

ROLLBACK TRANSACTION RETURN 23;

END
ELSE BEGIN
SELECT
	@existingMappingID = (
		SELECT
			TesterMappingID
		FROM
			TesterMapping
		WHERE
			TesterMapping.TestStationID = @elementID1
			AND TesterMapping.TesterID = @elementID2
	) IF @existingMappingID is null BEGIN RAISERROR ('Mapping does not exist.', 16, 1);

ROLLBACK TRANSACTION RETURN 24
END If @ErrorCode = 0 BEGIN
DELETE FROM
	TesterMapping
WHERE
	TesterMapping.TesterMappingID = @existingMappingID
Select
	@ErrorCode = @@Error
END
END
END
ELSE IF @elementType1 = 'Tester' BEGIN IF @elementType2 <> 'Station' BEGIN RAISERROR ('Element types are incompatible.', 16, 1);

ROLLBACK TRANSACTION RETURN 25;

END
ELSE BEGIN
SELECT
	@existingMappingID = (
		SELECT
			TesterMappingID
		FROM
			TesterMapping
		WHERE
			TesterMapping.TestStationID = @elementID2
			AND TesterMapping.TesterID = @elementID1
	) IF @existingMappingID is null BEGIN RAISERROR ('Mapping does not exist.', 16, 1);

ROLLBACK TRANSACTION RETURN 26
END If @ErrorCode = 0 BEGIN
DELETE FROM
	TesterMapping
WHERE
	TesterMapping.TesterMappingID = @existingMappingID
Select
	@ErrorCode = @@Error
END
END
END
ELSE BEGIN RAISERROR ('Invalid element types specified.', 16, 1);

ROLLBACK TRANSACTION RETURN 27;

END --Update element1 user ID and mod time
IF @ErrorCode = 0 BEGIN
UPDATE
	Elements
SET
	ModificationTime = @modTime
WHERE
	ElementID = @elementID1
Select
	@ErrorCode = @@Error
END IF @ErrorCode = 0 BEGIN
UPDATE
	Elements
SET
	UserID = @theUserID
WHERE
	ElementID = @elementID1
Select
	@ErrorCode = @@Error
END --Update element2 user ID and mod time
IF @ErrorCode = 0 BEGIN
UPDATE
	Elements
SET
	ModificationTime = @modTime
WHERE
	ElementID = @elementID2
Select
	@ErrorCode = @@Error
END IF @ErrorCode = 0 BEGIN
UPDATE
	Elements
SET
	UserID = @theUserID
WHERE
	ElementID = @elementID2
Select
	@ErrorCode = @@Error
END --Update test plan software version
IF @ErrorCode = 0 BEGIN
UPDATE
	TestPlans
SET
	TestPlans.SoftwareVersion = @softwareVersion
WHERE
	TestPlans.TestPlanID = @theTestPlanID
Select
	@ErrorCode = @@Error
END ----END TRANSACTION----------------------------
IF @@TranCount > @TransactionCountOnEntry Begin If @ErrorCode = 0 COMMIT TRANSACTION
Else ROLLBACK TRANSACTION
End -----------------------------------------------
Return @ErrorCode
END
GO
	/****** Object:  StoredProcedure [dbo].[sp_DeleteProperty]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE PROCEDURE [dbo].[sp_DeleteProperty] @userName varchar(150),
	@softwareVersion varchar(50),
	@elementIdentifier varchar(255),
	@propertyName varchar(255),
	@testPlanName varchar(255),
	@testPlanRevision int AS BEGIN --http://technet.microsoft.com/en-us/library/aa175920(v=sql.80).aspx
	Declare @ErrorCode int
Select
	@ErrorCode = @@Error IF LTRIM(RTRIM(@userName)) = '' BEGIN RAISERROR ('Empty user name input field.', 16, 1);

RETURN 1;

END IF LTRIM(RTRIM(@softwareVersion)) = '' BEGIN RAISERROR ('Empty software version input field.', 16, 1);

RETURN 2;

END IF LTRIM(RTRIM(@elementIdentifier)) = '' BEGIN RAISERROR ('Empty element identifier input field.', 16, 1);

RETURN 3;

END IF LTRIM(RTRIM(@propertyName)) = '' BEGIN RAISERROR ('Empty property name input field.', 16, 1);

RETURN 4;

END IF LTRIM(RTRIM(@testPlanName)) = '' BEGIN RAISERROR ('Empty test plan name input field.', 16, 1);

RETURN 5;

END DECLARE @theTestPlanID int
SELECT
	@theTestPlanID = (
		SELECT
			TestPlanID
		from
			TestPlans
		WHERE
			TestPlans.Name = @testPlanName
			AND TestPlans.Revision = @testPlanRevision
	) IF @theTestPlanID is null BEGIN RAISERROR (
		'Test Plan does not exist with the specified name and revision.',
		16,
		1
	);

RETURN 6;

END DECLARE @isReadOnly int EXEC @ErrorCode = sp_IsTestPlanReadOnly @testPlanName,
@testPlanRevision,
@isReadOnly = @isReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_IsTestPlanReadOnly returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF 1 = @isReadOnly Begin RAISERROR (
	'Can only create properties in the working copy.',
	16,
	1
);

RETURN 7;

End --Make sure the software version is compatible
DECLARE @success bit EXEC @ErrorCode = sp_SoftwareVersionCheck @softwareVersion,
@theTestPlanID,
@success = @success OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_SoftwareVersionCheck returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF @success <> 1 BEGIN RAISERROR ('Failed Software Version check.', 16, 1);

RETURN 8;

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

RETURN 9;

END --Make sure the user exists and has permissions
DECLARE @isUserReadOnly bit EXEC @ErrorCode = sp_IsUserReadOnly @userName,
@isUserReadOnly = @isUserReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_IsUserReadOnly returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF @isUserReadOnly is null BEGIN RAISERROR ('User does not exist.', 16, 1);

RETURN 10;

END IF @isUserReadOnly <> 0
OR @isUserReadOnly is null BEGIN RAISERROR ('User does not have permissions.', 16, 1);

RETURN 11;

END DECLARE @elementID int
SELECT
	@elementID = (
		SELECT
			ElementID
		FROM
			Elements
		WHERE
			Identifier = @elementIdentifier
			AND TestPlanID = @theTestPlanID
	) IF @elementID is null BEGIN RAISERROR (
		'Element does not exist with the specified identifier.',
		16,
		1
	);

RETURN 12;

END DECLARE @propertyID int
SELECT
	@propertyID = (
		SELECT
			PropertyID
		FROM
			Properties
		WHERE
			Name = @propertyName
			AND ElementID = @elementID
	) IF @propertyID is null BEGIN RAISERROR (
		'Property does not exist with the specified name.',
		16,
		1
	);

RETURN 12;

END DECLARE @modTime BIGINT
SELECT
	@modTime = (
		SELECT
			DATEDIFF(ss, '1/1/1970 00:00:00', GETUTCDATE())
	) ----START TRANSACTION----------------------------
	Declare @TransactionCountOnEntry int If @ErrorCode = 0 Begin
Select
	@TransactionCountOnEntry = @@TranCount BEGIN TRANSACTION
End -----------------------------------------------
If @ErrorCode = 0 Begin
DELETE FROM
	Properties
WHERE
	Properties.PropertyID = @propertyID
Select
	@ErrorCode = @@Error
End If @ErrorCode = 0 BEGIN
UPDATE
	Elements
SET
	ModificationTime = @modTime
WHERE
	ElementID = @elementID
Select
	@ErrorCode = @@Error
END if @ErrorCode = 0 BEGIN
UPDATE
	Elements
SET
	UserID = @theUserID
WHERE
	ElementID = @elementID
Select
	@ErrorCode = @@Error
END If @ErrorCode = 0 BEGIN
UPDATE
	TestPlans
SET
	TestPlans.SoftwareVersion = @softwareVersion
WHERE
	TestPlans.TestPlanID = @theTestPlanID
Select
	@ErrorCode = @@Error
END ----END TRANSACTION----------------------------
If @@TranCount > @TransactionCountOnEntry Begin If @ErrorCode = 0 COMMIT TRANSACTION
Else ROLLBACK TRANSACTION
End -----------------------------------------------
Return @ErrorCode
END
GO
	/****** Object:  StoredProcedure [dbo].[sp_DeleteTag]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE PROCEDURE [dbo].[sp_DeleteTag] @userName varchar(150),
	@softwareVersion varchar(50),
	@elementIdentifier varchar(255),
	@tagName varchar(150),
	@testPlanName varchar(255),
	@testPlanRevision int AS BEGIN --http://technet.microsoft.com/en-us/library/aa175920(v=sql.80).aspx
	Declare @ErrorCode int
Select
	@ErrorCode = @@Error IF LTRIM(RTRIM(@userName)) = '' BEGIN RAISERROR ('Empty user name input field.', 16, 1);

RETURN 1;

END IF LTRIM(RTRIM(@softwareVersion)) = '' BEGIN RAISERROR ('Empty software version input field.', 16, 1);

RETURN 2;

END IF LTRIM(RTRIM(@elementIdentifier)) = '' BEGIN RAISERROR ('Empty element identifier input field.', 16, 1);

RETURN 3;

END IF LTRIM(RTRIM(@tagName)) = '' BEGIN RAISERROR ('Empty tag name input field.', 16, 1);

RETURN 4;

END IF LTRIM(RTRIM(@testPlanName)) = '' BEGIN RAISERROR ('Empty test plan name input field.', 16, 1);

RETURN 5;

END DECLARE @theTestPlanID int
SELECT
	@theTestPlanID = (
		SELECT
			TestPlanID
		from
			TestPlans
		WHERE
			TestPlans.Name = @testPlanName
			AND TestPlans.Revision = @testPlanRevision
	) IF @theTestPlanID is null BEGIN RAISERROR (
		'Test Plan does not exist with the specified name and revision.',
		16,
		1
	);

RETURN 6;

END DECLARE @isReadOnly int EXEC @ErrorCode = sp_IsTestPlanReadOnly @testPlanName,
@testPlanRevision,
@isReadOnly = @isReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_IsTestPlanReadOnly returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF 1 = @isReadOnly Begin RAISERROR (
	'Can only delete tags in the working copy.',
	16,
	1
);

RETURN 7;

End --Make sure the software version is compatible
DECLARE @success bit EXEC @ErrorCode = sp_SoftwareVersionCheck @softwareVersion,
@theTestPlanID,
@success = @success OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_SoftwareVersionCheck returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF @success <> 1 BEGIN RAISERROR ('Failed Software Version check.', 16, 1);

RETURN 8;

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

RETURN 9;

END --Make sure the user exists and has permissions
DECLARE @isUserReadOnly bit EXEC @ErrorCode = sp_IsUserReadOnly @userName,
@isUserReadOnly = @isUserReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_IsUserReadOnly returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF @isUserReadOnly is null BEGIN RAISERROR ('User does not exist.', 16, 1);

RETURN 10;

END IF @isUserReadOnly <> 0
OR @isUserReadOnly is null BEGIN RAISERROR ('User does not have permissions.', 16, 1);

RETURN 11;

END DECLARE @elementID int
SELECT
	@elementID = (
		SELECT
			ElementID
		FROM
			Elements
		WHERE
			Identifier = @elementIdentifier
			AND TestPlanID = @theTestPlanID
	) IF @elementID is null BEGIN RAISERROR (
		'Element does not exist with the specified identifier.',
		16,
		1
	);

RETURN 12;

END DECLARE @tagNameID int
SELECT
	@tagNameID = (
		SELECT
			TagID
		FROM
			Tags
		WHERE
			Tags.Name = @tagName
	) IF @tagNameID is null BEGIN BEGIN RAISERROR ('The specified tag name does not exist.', 16, 1);

RETURN 12;

END
END DECLARE @elementTagID int
SELECT
	@elementTagID = (
		SELECT
			ElementTagID
		FROM
			ElementTags
		WHERE
			ElementID = @elementID
			AND TagID = @tagNameID
	) IF @elementTagID is null BEGIN RAISERROR (
		'Element does not have a tag with the specified name.',
		16,
		1
	);

RETURN 13;

END DECLARE @modTime BIGINT
SELECT
	@modTime = (
		SELECT
			DATEDIFF(ss, '1/1/1970 00:00:00', GETUTCDATE())
	) ----START TRANSACTION----------------------------
	Declare @TransactionCountOnEntry int If @ErrorCode = 0 Begin
Select
	@TransactionCountOnEntry = @@TranCount BEGIN TRANSACTION
End -----------------------------------------------
If @ErrorCode = 0 Begin
DELETE FROM
	ElementTags
WHERE
	ElementTags.ElementTagID = @elementTagID
Select
	@ErrorCode = @@Error
End If @ErrorCode = 0 BEGIN
UPDATE
	Elements
SET
	ModificationTime = @modTime
WHERE
	ElementID = @elementID
Select
	@ErrorCode = @@Error
END if @ErrorCode = 0 BEGIN
UPDATE
	Elements
SET
	UserID = @theUserID
WHERE
	ElementID = @elementID
Select
	@ErrorCode = @@Error
END If @ErrorCode = 0 BEGIN
UPDATE
	TestPlans
SET
	TestPlans.SoftwareVersion = @softwareVersion
WHERE
	TestPlans.TestPlanID = @theTestPlanID
Select
	@ErrorCode = @@Error
END ----END TRANSACTION----------------------------
If @@TranCount > @TransactionCountOnEntry Begin If @ErrorCode = 0 COMMIT TRANSACTION
Else ROLLBACK TRANSACTION
End -----------------------------------------------
Return @ErrorCode
END
GO
	/****** Object:  StoredProcedure [dbo].[sp_GrantUserPermissions]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE PROCEDURE [dbo].[sp_GrantUserPermissions] @grantingUser varchar(150),
	@grantedUser varchar(150),
	@readOnlyPermission bit AS BEGIN --http://technet.microsoft.com/en-us/library/aa175920(v=sql.80).aspx
	Declare @ErrorCode int
Select
	@ErrorCode = @@Error IF LTRIM(RTRIM(@grantingUser)) = '' BEGIN RAISERROR ('Empty granting user name input field.', 16, 1);

RETURN 1;

END IF LTRIM(RTRIM(@grantedUser)) = '' BEGIN RAISERROR ('Empty granted user name input field.', 16, 1);

RETURN 2;

END IF @readOnlyPermission is null BEGIN RAISERROR ('Read only permission is null.', 16, 1);

RETURN 3;

END DECLARE @theGrantingUserID int
SET
	@theGrantingUserID = (
		SELECT
			UserID
		FROM
			Users
		WHERE
			Users.Name = @grantingUser
	) IF @theGrantingUserID is null BEGIN RAISERROR ('The granting user does not exist.', 16, 1);

RETURN 4;

END DECLARE @theGrantedUserID varchar(max)
SET
	@theGrantedUserID = (
		SELECT
			UserID
		FROM
			Users
		WHERE
			Users.Name = @grantedUser
	) IF @theGrantedUserID is null BEGIN RAISERROR ('The granted user does not exist.', 16, 1);

RETURN 5;

END --Make sure the granting user has permissions
DECLARE @isUserReadOnly bit EXEC @ErrorCode = sp_IsUserReadOnly @grantingUser,
@isUserReadOnly = @isUserReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_IsUserReadOnly returned an error code.',
	16,
	1
);

RETURN @ErrorCode
END IF @isUserReadOnly <> 0
OR @isUserReadOnly is null BEGIN RAISERROR (
	'Granting user does not have permissions.',
	16,
	1
);

RETURN 6;

END --Don't allow a user to change his own permissions
IF @grantingUser = @grantedUser BEGIN RAISERROR ('You cannot modify your own permissions.', 16, 1);

RETURN 7;

END ----START TRANSACTION----------------------------
Declare @TransactionCountOnEntry int If @ErrorCode = 0 Begin
Select
	@TransactionCountOnEntry = @@TranCount BEGIN TRANSACTION
End -----------------------------------------------
If @ErrorCode = 0 BEGIN
UPDATE
	Users
SET
	Users.ReadOnly = @readOnlyPermission
WHERE
	Users.Name = @grantedUser
Select
	@ErrorCode = @@Error
END ----END TRANSACTION----------------------------
If @@TranCount > @TransactionCountOnEntry Begin If @ErrorCode = 0 COMMIT TRANSACTION
Else ROLLBACK TRANSACTION
End -----------------------------------------------
Return @ErrorCode
END
GO
	/****** Object:  StoredProcedure [dbo].[sp_IsTestPlanReadOnly]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE PROCEDURE [dbo].[sp_IsTestPlanReadOnly] @name varchar(255),
	@revision int,
	@isReadOnly bit output AS BEGIN --http://technet.microsoft.com/en-us/library/aa175920(v=sql.80).aspx
	Declare @ErrorCode int
Select
	@ErrorCode = @@Error
SET
	@isReadOnly = 1 IF LTRIM(RTRIM(@name)) = '' BEGIN RAISERROR ('Empty test plan name input field.', 16, 1);

RETURN 1;

END --Every revision lower than the highest revision is read only
DECLARE @theHighestRevision int
SELECT
	@theHighestRevision = MAX(Revision)
from
	TestPlans
WHERE
	TestPlans.Name = @name IF @theHighestRevision is null BEGIN RAISERROR ('Invalid test plan name specified.', 16, 1);

RETURN 2;

END
ELSE BEGIN DECLARE @theTestPlanID int
SET
	@theTestPlanID = (
		SELECT
			TestPlanId
		FROM
			TestPlans
		WHERE
			TestPlans.Name = @name
			AND TestPlans.Revision = @revision
	) IF @theTestPlanID is null BEGIN RAISERROR ('Invalid test plan revision specified.', 16, 1);

RETURN 3;

END
END IF @revision = @theHighestRevision
SET
	@isReadOnly = 0
	ELSE
SET
	@isReadOnly = 1 IF @ErrorCode <> 0 BEGIN
SET
	@isReadOnly = 1
END Return @ErrorCode
END
GO
	/****** Object:  StoredProcedure [dbo].[sp_IsUserReadOnly]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE PROCEDURE [dbo].[sp_IsUserReadOnly] @name varchar(150),
	@isUserReadOnly bit output AS BEGIN --http://technet.microsoft.com/en-us/library/aa175920(v=sql.80).aspx
	Declare @ErrorCode int
Select
	@ErrorCode = @@Error
SET
	@isUserReadOnly = 1 IF LTRIM(RTRIM(@name)) = '' BEGIN RAISERROR ('Empty user name input field.', 16, 1);

RETURN 1;

END
SET
	@isUserReadOnly = (
		SELECT
			ReadOnly
		FROM
			Users
		WHERE
			Name = @name
	) IF @isUserReadOnly is null BEGIN RAISERROR ('Invalid user name specified.', 16, 1);

RETURN 2;

END IF @ErrorCode <> 0 BEGIN
SET
	@isUserReadOnly = 1
END Return @ErrorCode
END
GO
	/****** Object:  StoredProcedure [dbo].[sp_LabelRevision]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE PROCEDURE [dbo].[sp_LabelRevision] @userName varchar(150),
	@softwareVersion varchar(50),
	@name varchar(255),
	@revision int,
	@label varchar(255),
	@testPlanID int output AS BEGIN --http://technet.microsoft.com/en-us/library/aa175920(v=sql.80).aspx
	Declare @ErrorCode int
Select
	@ErrorCode = @@Error DECLARE @theTestPlanID int
SELECT
	@theTestPlanID = (
		SELECT
			TestPlanID
		from
			TestPlans
		WHERE
			TestPlans.Name = @name
			AND TestPlans.Revision = @revision
	)
SET
	@testPlanID = @theTestPlanID --Make sure the software version is compatible
	DECLARE @success bit EXEC @ErrorCode = sp_SoftwareVersionCheck @softwareVersion,
	@theTestPlanID,
	@success = @success OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
		'sp_SoftwareVersionCheck returned an error code.',
		16,
		1
	);

RETURN @ErrorCode;

END IF @success <> 1 BEGIN RAISERROR ('Failed Software Version check.', 16, 1);

RETURN 1;

END --Make sure the user has permissions
DECLARE @isUserReadOnly bit EXEC @ErrorCode = sp_IsUserReadOnly @userName,
@isUserReadOnly = @isUserReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_IsUserReadOnly returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF @isUserReadOnly is null BEGIN RAISERROR ('User does not exist.', 16, 1);

RETURN 2;

END IF @isUserReadOnly <> 0
or @isUserReadOnly is null BEGIN RAISERROR ('User does not have permissions.', 16, 1);

RETURN 3;

END ----START TRANSACTION----------------------------
Declare @TransactionCountOnEntry int If @ErrorCode = 0 Begin
Select
	@TransactionCountOnEntry = @@TranCount BEGIN TRANSACTION
End -----------------------------------------------
If @ErrorCode = 0 BEGIN
UPDATE
	TestPlans
SET
	TestPlans.SoftwareVersion = @softwareVersion
WHERE
	TestPlans.TestPlanID = @theTestPlanID
Select
	@ErrorCode = @@Error
END If @ErrorCode = 0 BEGIN
UPDATE
	TestPlans
SET
	TestPlans.RevisionLabel = LTRIM(RTRIM(@label))
WHERE
	TestPlans.TestPlanID = @theTestPlanID
Select
	@ErrorCode = @@Error
END ----END TRANSACTION----------------------------
If @@TranCount > @TransactionCountOnEntry Begin If @ErrorCode = 0 COMMIT TRANSACTION
Else ROLLBACK TRANSACTION
End -----------------------------------------------
Return @ErrorCode
END
GO
	/****** Object:  StoredProcedure [dbo].[sp_MapFailureModeToEvaluation]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE PROCEDURE [dbo].[sp_MapFailureModeToEvaluation] @userName varchar(150),
	@softwareVersion varchar(50),
	@failureModeIdentifier varchar(255),
	@evaluationIdentifier varchar(255),
	@testPlanName varchar(255),
	@testPlanRevision int,
	@mappingID int output AS BEGIN --http://technet.microsoft.com/en-us/library/aa175920(v=sql.80).aspx
	Declare @ErrorCode int
Select
	@ErrorCode = @@Error IF LTRIM(RTRIM(@userName)) = '' BEGIN RAISERROR ('Empty user name input field.', 16, 1);

RETURN 1;

END IF LTRIM(RTRIM(@softwareVersion)) = '' BEGIN RAISERROR ('Empty software version input field.', 16, 1);

RETURN 2;

END IF LTRIM(RTRIM(@failureModeIdentifier)) = '' BEGIN RAISERROR (
	'Empty failure mode identifier input field.',
	16,
	1
);

RETURN 3;

END IF LTRIM(RTRIM(@evaluationIdentifier)) = '' BEGIN RAISERROR (
	'Empty evaluation identifier input field.',
	16,
	1
);

RETURN 4;

END IF LTRIM(RTRIM(@testPlanName)) = '' BEGIN RAISERROR ('Empty test plan name input field.', 16, 1);

RETURN 5;

END DECLARE @theTestPlanID int
SELECT
	@theTestPlanID = (
		SELECT
			TestPlanID
		from
			TestPlans
		WHERE
			TestPlans.Name = @testPlanName
			AND TestPlans.Revision = @testPlanRevision
	) IF @theTestPlanID is null BEGIN RAISERROR (
		'Test Plan does not exist with the specified name and revision.',
		16,
		1
	);

RETURN 6;

END DECLARE @isReadOnly int EXEC @ErrorCode = sp_IsTestPlanReadOnly @testPlanName,
@testPlanRevision,
@isReadOnly = @isReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_IsTestPlanReadOnly returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF 1 = @isReadOnly Begin RAISERROR (
	'Can only create mappings in the working copy.',
	16,
	1
);

RETURN 7;

End --Make sure the software version is compatible
DECLARE @success bit EXEC @ErrorCode = sp_SoftwareVersionCheck @softwareVersion,
@theTestPlanID,
@success = @success OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_SoftwareVersionCheck returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF @success <> 1 BEGIN RAISERROR ('Failed Software Version check.', 16, 1);

RETURN 8;

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

RETURN 9;

END --Make sure the user exists and has permissions
DECLARE @isUserReadOnly bit EXEC @ErrorCode = sp_IsUserReadOnly @userName,
@isUserReadOnly = @isUserReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_IsUserReadOnly returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF @isUserReadOnly is null BEGIN RAISERROR ('User does not exist.', 16, 1);

RETURN 10;

END IF @isUserReadOnly <> 0
OR @isUserReadOnly is null BEGIN RAISERROR ('User does not have permissions.', 16, 1);

RETURN 11;

END DECLARE @failureModeID int
SELECT
	@failureModeID = (
		SELECT
			ElementID
		FROM
			Elements
		WHERE
			Identifier = @failureModeIdentifier
			AND TestPlanID = @theTestPlanID
	) IF @failureModeID is null BEGIN RAISERROR (
		'Element does not exist with the specified failure mode identifier.',
		16,
		1
	);

RETURN 12;

END DECLARE @evaluationID int
SELECT
	@evaluationID = (
		SELECT
			ElementID
		FROM
			Elements
		WHERE
			Identifier = @evaluationIdentifier
			AND TestPlanID = @theTestPlanID
	) IF @evaluationID is null BEGIN RAISERROR (
		'Element does not exist with the specified evaluation identifier.',
		16,
		1
	);

RETURN 13;

END IF @failureModeIdentifier = @evaluationIdentifier BEGIN RAISERROR (
	'FailureMode element identifier cannot be the same as the Evaluation identifier.',
	16,
	1
);

RETURN 14;

END --Check Types
DECLARE @theFailureModeElementType varchar(MAX)
SET
	@theFailureModeElementType = (
		SELECT
			Type
		FROM
			ElementTypes
			INNER JOIN Elements ON ElementTypes.ElementTypeID = Elements.ElementTypeID
		WHERE
			Elements.ElementID = @failureModeID
	) IF 'FailureMode' <> @theFailureModeElementType BEGIN RAISERROR (
		'The specified failure mode element is not the correct type.',
		16,
		1
	);

RETURN 15;

END DECLARE @theEvaluationElementType varchar(MAX)
SET
	@theEvaluationElementType = (
		SELECT
			Type
		FROM
			ElementTypes
			INNER JOIN Elements ON ElementTypes.ElementTypeID = Elements.ElementTypeID
		WHERE
			Elements.ElementID = @evaluationID
	) IF 'Evaluation' <> @theEvaluationElementType BEGIN RAISERROR (
		'The specified evaluation element is not the correct type.',
		16,
		1
	);

RETURN 16;

END DECLARE @modTime BIGINT
SELECT
	@modTime = (
		SELECT
			DATEDIFF(ss, '1/1/1970 00:00:00', GETUTCDATE())
	) ----START TRANSACTION----------------------------
	Declare @TransactionCountOnEntry int If @ErrorCode = 0 Begin
Select
	@TransactionCountOnEntry = @@TranCount BEGIN TRANSACTION
End -----------------------------------------------
--Insert the mapping
If @ErrorCode = 0 BEGIN
INSERT INTO
	CoverageMapping (FailureModeID, EvaluationID)
VALUES
	(@failureModeID, @evaluationID)
SELECT
	@mappingID = (
		SELECT
			SCOPE_IDENTITY()
	),
	@ErrorCode = @@Error
END --Update failure mode element user ID and mod time
IF @ErrorCode = 0 BEGIN
UPDATE
	Elements
SET
	ModificationTime = @modTime
WHERE
	ElementID = @failureModeID
Select
	@ErrorCode = @@Error
END IF @ErrorCode = 0 BEGIN
UPDATE
	Elements
SET
	UserID = @theUserID
WHERE
	ElementID = @failureModeID
Select
	@ErrorCode = @@Error
END --Update evaluation element user ID and mod time
IF @ErrorCode = 0 BEGIN
UPDATE
	Elements
SET
	ModificationTime = @modTime
WHERE
	ElementID = @evaluationID
Select
	@ErrorCode = @@Error
END IF @ErrorCode = 0 BEGIN
UPDATE
	Elements
SET
	UserID = @theUserID
WHERE
	ElementID = @evaluationID
Select
	@ErrorCode = @@Error
END --Update test plan software version
IF @ErrorCode = 0 BEGIN
UPDATE
	TestPlans
SET
	TestPlans.SoftwareVersion = @softwareVersion
WHERE
	TestPlans.TestPlanID = @theTestPlanID
Select
	@ErrorCode = @@Error
END ----END TRANSACTION----------------------------
IF @@TranCount > @TransactionCountOnEntry Begin If @ErrorCode = 0 COMMIT TRANSACTION
Else ROLLBACK TRANSACTION
End -----------------------------------------------
Return @ErrorCode
END
GO
	/****** Object:  StoredProcedure [dbo].[sp_MapTestStationToFixture]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE PROCEDURE [dbo].[sp_MapTestStationToFixture] @userName varchar(150),
	@softwareVersion varchar(50),
	@testStationIdentifier varchar(255),
	@testFixtureIdentifier varchar(255),
	@testPlanName varchar(255),
	@testPlanRevision int,
	@mappingID int output AS BEGIN --http://technet.microsoft.com/en-us/library/aa175920(v=sql.80).aspx
	Declare @ErrorCode int
Select
	@ErrorCode = @@Error IF LTRIM(RTRIM(@userName)) = '' BEGIN RAISERROR ('Empty user name input field.', 16, 1);

RETURN 1;

END IF LTRIM(RTRIM(@softwareVersion)) = '' BEGIN RAISERROR ('Empty software version input field.', 16, 1);

RETURN 2;

END IF LTRIM(RTRIM(@testStationIdentifier)) = '' BEGIN RAISERROR (
	'Empty test station identifier input field.',
	16,
	1
);

RETURN 3;

END IF LTRIM(RTRIM(@testFixtureIdentifier)) = '' BEGIN RAISERROR (
	'Empty test fixture identifier input field.',
	16,
	1
);

RETURN 4;

END IF LTRIM(RTRIM(@testPlanName)) = '' BEGIN RAISERROR ('Empty test plan name input field.', 16, 1);

RETURN 5;

END DECLARE @theTestPlanID int
SELECT
	@theTestPlanID = (
		SELECT
			TestPlanID
		from
			TestPlans
		WHERE
			TestPlans.Name = @testPlanName
			AND TestPlans.Revision = @testPlanRevision
	) IF @theTestPlanID is null BEGIN RAISERROR (
		'Test Plan does not exist with the specified name and revision.',
		16,
		1
	);

RETURN 6;

END DECLARE @isReadOnly int EXEC @ErrorCode = sp_IsTestPlanReadOnly @testPlanName,
@testPlanRevision,
@isReadOnly = @isReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_IsTestPlanReadOnly returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF 1 = @isReadOnly Begin RAISERROR (
	'Can only create mappings in the working copy.',
	16,
	1
);

RETURN 7;

End --Make sure the software version is compatible
DECLARE @success bit EXEC @ErrorCode = sp_SoftwareVersionCheck @softwareVersion,
@theTestPlanID,
@success = @success OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_SoftwareVersionCheck returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF @success <> 1 BEGIN RAISERROR ('Failed Software Version check.', 16, 1);

RETURN 8;

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

RETURN 9;

END --Make sure the user exists and has permissions
DECLARE @isUserReadOnly bit EXEC @ErrorCode = sp_IsUserReadOnly @userName,
@isUserReadOnly = @isUserReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_IsUserReadOnly returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF @isUserReadOnly is null BEGIN RAISERROR ('User does not exist.', 16, 1);

RETURN 10;

END IF @isUserReadOnly <> 0
OR @isUserReadOnly is null BEGIN RAISERROR ('User does not have permissions.', 16, 1);

RETURN 11;

END DECLARE @testStationID int
SELECT
	@testStationID = (
		SELECT
			ElementID
		FROM
			Elements
		WHERE
			Identifier = @testStationIdentifier
			AND TestPlanID = @theTestPlanID
	) IF @testStationID is null BEGIN RAISERROR (
		'Element does not exist with the specified test station identifier.',
		16,
		1
	);

RETURN 12;

END DECLARE @testFixtureID int
SELECT
	@testFixtureID = (
		SELECT
			ElementID
		FROM
			Elements
		WHERE
			Identifier = @testFixtureIdentifier
			AND TestPlanID = @theTestPlanID
	) IF @testFixtureID is null BEGIN RAISERROR (
		'Element does not exist with the specified test fixture identifier.',
		16,
		1
	);

RETURN 13;

END IF @testStationIdentifier = @testFixtureIdentifier BEGIN RAISERROR (
	'Test station element identifier cannot be the same as the test fixture identifier.',
	16,
	1
);

RETURN 14;

END --Check Types
DECLARE @theTestStationElementType varchar(MAX)
SET
	@theTestStationElementType = (
		SELECT
			Type
		FROM
			ElementTypes
			INNER JOIN Elements ON ElementTypes.ElementTypeID = Elements.ElementTypeID
		WHERE
			Elements.ElementID = @testStationID
	) IF 'Station' <> @theTestStationElementType BEGIN RAISERROR (
		'The specified test station element is not the correct type.',
		16,
		1
	);

RETURN 15;

END DECLARE @theTestFixtureElementType varchar(MAX)
SET
	@theTestFixtureElementType = (
		SELECT
			Type
		FROM
			ElementTypes
			INNER JOIN Elements ON ElementTypes.ElementTypeID = Elements.ElementTypeID
		WHERE
			Elements.ElementID = @testFixtureID
	) IF 'Fixture' <> @theTestFixtureElementType BEGIN RAISERROR (
		'The specified test fixture element is not the correct type.',
		16,
		1
	);

RETURN 16;

END DECLARE @modTime BIGINT
SELECT
	@modTime = (
		SELECT
			DATEDIFF(ss, '1/1/1970 00:00:00', GETUTCDATE())
	) ----START TRANSACTION----------------------------
	Declare @TransactionCountOnEntry int If @ErrorCode = 0 Begin
Select
	@TransactionCountOnEntry = @@TranCount BEGIN TRANSACTION
End -----------------------------------------------
--Insert the mapping
If @ErrorCode = 0 BEGIN
INSERT INTO
	FixtureMapping (TestStationID, TestFixtureID)
VALUES
	(@testStationID, @testFixtureID)
SELECT
	@mappingID = (
		SELECT
			SCOPE_IDENTITY()
	),
	@ErrorCode = @@Error
END --Update test station element user ID and mod time
IF @ErrorCode = 0 BEGIN
UPDATE
	Elements
SET
	ModificationTime = @modTime
WHERE
	ElementID = @testStationID
Select
	@ErrorCode = @@Error
END IF @ErrorCode = 0 BEGIN
UPDATE
	Elements
SET
	UserID = @theUserID
WHERE
	ElementID = @testStationID
Select
	@ErrorCode = @@Error
END --Update test fixture element user ID and mod time
IF @ErrorCode = 0 BEGIN
UPDATE
	Elements
SET
	ModificationTime = @modTime
WHERE
	ElementID = @testFixtureID
Select
	@ErrorCode = @@Error
END IF @ErrorCode = 0 BEGIN
UPDATE
	Elements
SET
	UserID = @theUserID
WHERE
	ElementID = @testFixtureID
Select
	@ErrorCode = @@Error
END --Update test plan software version
IF @ErrorCode = 0 BEGIN
UPDATE
	TestPlans
SET
	TestPlans.SoftwareVersion = @softwareVersion
WHERE
	TestPlans.TestPlanID = @theTestPlanID
Select
	@ErrorCode = @@Error
END ----END TRANSACTION----------------------------
IF @@TranCount > @TransactionCountOnEntry Begin If @ErrorCode = 0 COMMIT TRANSACTION
Else ROLLBACK TRANSACTION
End -----------------------------------------------
Return @ErrorCode
END
GO
	/****** Object:  StoredProcedure [dbo].[sp_MapTestStationToTester]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE PROCEDURE [dbo].[sp_MapTestStationToTester] @userName varchar(150),
	@softwareVersion varchar(50),
	@testStationIdentifier varchar(255),
	@testerIdentifier varchar(255),
	@testPlanName varchar(255),
	@testPlanRevision int,
	@mappingID int output AS BEGIN --http://technet.microsoft.com/en-us/library/aa175920(v=sql.80).aspx
	Declare @ErrorCode int
Select
	@ErrorCode = @@Error IF LTRIM(RTRIM(@userName)) = '' BEGIN RAISERROR ('Empty user name input field.', 16, 1);

RETURN 1;

END IF LTRIM(RTRIM(@softwareVersion)) = '' BEGIN RAISERROR ('Empty software version input field.', 16, 1);

RETURN 2;

END IF LTRIM(RTRIM(@testStationIdentifier)) = '' BEGIN RAISERROR (
	'Empty test station identifier input field.',
	16,
	1
);

RETURN 3;

END IF LTRIM(RTRIM(@testerIdentifier)) = '' BEGIN RAISERROR ('Empty tester identifier input field.', 16, 1);

RETURN 4;

END IF LTRIM(RTRIM(@testPlanName)) = '' BEGIN RAISERROR ('Empty test plan name input field.', 16, 1);

RETURN 5;

END DECLARE @theTestPlanID int
SELECT
	@theTestPlanID = (
		SELECT
			TestPlanID
		from
			TestPlans
		WHERE
			TestPlans.Name = @testPlanName
			AND TestPlans.Revision = @testPlanRevision
	) IF @theTestPlanID is null BEGIN RAISERROR (
		'Test Plan does not exist with the specified name and revision.',
		16,
		1
	);

RETURN 6;

END DECLARE @isReadOnly int EXEC @ErrorCode = sp_IsTestPlanReadOnly @testPlanName,
@testPlanRevision,
@isReadOnly = @isReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_IsTestPlanReadOnly returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF 1 = @isReadOnly Begin RAISERROR (
	'Can only create mappings in the working copy.',
	16,
	1
);

RETURN 7;

End --Make sure the software version is compatible
DECLARE @success bit EXEC @ErrorCode = sp_SoftwareVersionCheck @softwareVersion,
@theTestPlanID,
@success = @success OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_SoftwareVersionCheck returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF @success <> 1 BEGIN RAISERROR ('Failed Software Version check.', 16, 1);

RETURN 8;

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

RETURN 9;

END --Make sure the user exists and has permissions
DECLARE @isUserReadOnly bit EXEC @ErrorCode = sp_IsUserReadOnly @userName,
@isUserReadOnly = @isUserReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_IsUserReadOnly returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF @isUserReadOnly is null BEGIN RAISERROR ('User does not exist.', 16, 1);

RETURN 10;

END IF @isUserReadOnly <> 0
OR @isUserReadOnly is null BEGIN RAISERROR ('User does not have permissions.', 16, 1);

RETURN 11;

END DECLARE @testStationID int
SELECT
	@testStationID = (
		SELECT
			ElementID
		FROM
			Elements
		WHERE
			Identifier = @testStationIdentifier
			AND TestPlanID = @theTestPlanID
	) IF @testStationID is null BEGIN RAISERROR (
		'Element does not exist with the specified test station identifier.',
		16,
		1
	);

RETURN 12;

END DECLARE @testerID int
SELECT
	@testerID = (
		SELECT
			ElementID
		FROM
			Elements
		WHERE
			Identifier = @testerIdentifier
			AND TestPlanID = @theTestPlanID
	) IF @testerID is null BEGIN RAISERROR (
		'Element does not exist with the specified tester identifier.',
		16,
		1
	);

RETURN 13;

END IF @testStationIdentifier = @testerIdentifier BEGIN RAISERROR (
	'Test station element identifier cannot be the same as the tester identifier.',
	16,
	1
);

RETURN 14;

END --Check Types
DECLARE @theTestStationElementType varchar(MAX)
SET
	@theTestStationElementType = (
		SELECT
			Type
		FROM
			ElementTypes
			INNER JOIN Elements ON ElementTypes.ElementTypeID = Elements.ElementTypeID
		WHERE
			Elements.ElementID = @testStationID
	) IF 'Station' <> @theTestStationElementType BEGIN RAISERROR (
		'The specified test station element is not the correct type.',
		16,
		1
	);

RETURN 15;

END DECLARE @theTesterElementType varchar(MAX)
SET
	@theTesterElementType = (
		SELECT
			Type
		FROM
			ElementTypes
			INNER JOIN Elements ON ElementTypes.ElementTypeID = Elements.ElementTypeID
		WHERE
			Elements.ElementID = @testerID
	) IF 'Tester' <> @theTesterElementType BEGIN RAISERROR (
		'The specified tester element is not the correct type.',
		16,
		1
	);

RETURN 16;

END DECLARE @modTime BIGINT
SELECT
	@modTime = (
		SELECT
			DATEDIFF(ss, '1/1/1970 00:00:00', GETUTCDATE())
	) ----START TRANSACTION----------------------------
	Declare @TransactionCountOnEntry int If @ErrorCode = 0 Begin
Select
	@TransactionCountOnEntry = @@TranCount BEGIN TRANSACTION
End -----------------------------------------------
--Insert the mapping
If @ErrorCode = 0 BEGIN
INSERT INTO
	TesterMapping (TestStationID, TesterID)
VALUES
	(@testStationID, @testerID)
SELECT
	@mappingID = (
		SELECT
			SCOPE_IDENTITY()
	),
	@ErrorCode = @@Error
END --Update test station element user ID and mod time
IF @ErrorCode = 0 BEGIN
UPDATE
	Elements
SET
	ModificationTime = @modTime
WHERE
	ElementID = @testStationID
Select
	@ErrorCode = @@Error
END IF @ErrorCode = 0 BEGIN
UPDATE
	Elements
SET
	UserID = @theUserID
WHERE
	ElementID = @testStationID
Select
	@ErrorCode = @@Error
END --Update tester element user ID and mod time
IF @ErrorCode = 0 BEGIN
UPDATE
	Elements
SET
	ModificationTime = @modTime
WHERE
	ElementID = @testerID
Select
	@ErrorCode = @@Error
END IF @ErrorCode = 0 BEGIN
UPDATE
	Elements
SET
	UserID = @theUserID
WHERE
	ElementID = @testerID
Select
	@ErrorCode = @@Error
END --Update test plan software version
IF @ErrorCode = 0 BEGIN
UPDATE
	TestPlans
SET
	TestPlans.SoftwareVersion = @softwareVersion
WHERE
	TestPlans.TestPlanID = @theTestPlanID
Select
	@ErrorCode = @@Error
END ----END TRANSACTION----------------------------
IF @@TranCount > @TransactionCountOnEntry Begin If @ErrorCode = 0 COMMIT TRANSACTION
Else ROLLBACK TRANSACTION
End -----------------------------------------------
Return @ErrorCode
END
GO
	/****** Object:  StoredProcedure [dbo].[sp_ModifyElementDescription]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE PROCEDURE [dbo].[sp_ModifyElementDescription] @userName varchar(150),
	@softwareVersion varchar(50),
	@identifier varchar(255),
	@newDescription varchar(2000),
	@testPlanName varchar(255),
	@testPlanRevision int,
	@elementID int output AS BEGIN --http://technet.microsoft.com/en-us/library/aa175920(v=sql.80).aspx
	Declare @ErrorCode int
Select
	@ErrorCode = @@Error IF LTRIM(RTRIM(@userName)) = '' BEGIN RAISERROR ('Empty user name input field.', 16, 1);

RETURN 1;

END IF LTRIM(RTRIM(@softwareVersion)) = '' BEGIN RAISERROR ('Empty software version input field.', 16, 1);

RETURN 2;

END IF LTRIM(RTRIM(@identifier)) = '' BEGIN RAISERROR ('Empty identifier input field.', 16, 1);

RETURN 3;

END IF LTRIM(RTRIM(@newDescription)) = '' BEGIN RAISERROR ('Empty new description input field.', 16, 1);

RETURN 4;

END IF LTRIM(RTRIM(@testPlanName)) = '' BEGIN RAISERROR ('Empty test plan name input field.', 16, 1);

RETURN 5;

END DECLARE @theTestPlanID int
SELECT
	@theTestPlanID = (
		SELECT
			TestPlanID
		from
			TestPlans
		WHERE
			TestPlans.Name = @testPlanName
			AND TestPlans.Revision = @testPlanRevision
	) IF @theTestPlanID is null BEGIN RAISERROR (
		'Test Plan does not exist with the specified name and revision.',
		16,
		1
	);

RETURN 6;

END DECLARE @theElementID int
SELECT
	@theElementID = (
		SELECT
			ElementID
		from
			Elements
		WHERE
			Elements.Identifier = @identifier
			AND Elements.TestPlanID = @theTestPlanID
	) IF @theElementID is null BEGIN RAISERROR (
		'Element does not exist in the Test Plan with the specified identifier.',
		16,
		1
	);

RETURN 7;

END
SET
	@elementID = @theElementID DECLARE @isReadOnly int EXEC @ErrorCode = sp_IsTestPlanReadOnly @testPlanName,
	@testPlanRevision,
	@isReadOnly = @isReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
		'sp_IsTestPlanReadOnly returned an error code.',
		16,
		1
	);

RETURN @ErrorCode;

END IF 1 = @isReadOnly Begin RAISERROR (
	'Can only modify Elements in the working copy.',
	16,
	1
);

RETURN 8;

End --Make sure the software version is compatible
DECLARE @success bit EXEC @ErrorCode = sp_SoftwareVersionCheck @softwareVersion,
@theTestPlanID,
@success = @success OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_SoftwareVersionCheck returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF @success <> 1 BEGIN RAISERROR ('Failed Software Version check.', 16, 1);

RETURN 9;

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

RETURN 10;

END --Make sure the user exists and has permissions
DECLARE @isUserReadOnly bit EXEC @ErrorCode = sp_IsUserReadOnly @userName,
@isUserReadOnly = @isUserReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_IsUserReadOnly returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF @isUserReadOnly is null BEGIN RAISERROR ('User does not exist.', 16, 1);

RETURN 11;

END IF @isUserReadOnly <> 0
OR @isUserReadOnly is null BEGIN RAISERROR ('User does not have permissions.', 16, 1);

RETURN 12;

END DECLARE @modTime BIGINT
SELECT
	@modTime = (
		SELECT
			DATEDIFF(ss, '1/1/1970 00:00:00', GETUTCDATE())
	) ----START TRANSACTION----------------------------
	Declare @TransactionCountOnEntry int If @ErrorCode = 0 Begin
Select
	@TransactionCountOnEntry = @@TranCount BEGIN TRANSACTION
End -----------------------------------------------
If @ErrorCode = 0 BEGIN
UPDATE
	Elements
SET
	Elements.Description = @newDescription
WHERE
	Elements.ElementID = @theElementID
Select
	@ErrorCode = @@Error
END If @ErrorCode = 0 BEGIN
UPDATE
	Elements
SET
	Elements.ModificationTime = @modTime
WHERE
	Elements.ElementID = @theElementID
Select
	@ErrorCode = @@Error
END If @ErrorCode = 0 BEGIN
UPDATE
	Elements
SET
	Elements.UserID = @theUserID
WHERE
	Elements.ElementID = @theElementID
Select
	@ErrorCode = @@Error
END If @ErrorCode = 0 BEGIN
UPDATE
	TestPlans
SET
	TestPlans.SoftwareVersion = @softwareVersion
WHERE
	TestPlans.TestPlanID = @theTestPlanID
Select
	@ErrorCode = @@Error
END ----END TRANSACTION----------------------------
If @@TranCount > @TransactionCountOnEntry Begin If @ErrorCode = 0 COMMIT TRANSACTION
Else ROLLBACK TRANSACTION
End -----------------------------------------------
Return @ErrorCode
END
GO
	/****** Object:  StoredProcedure [dbo].[sp_ModifyElementSequence]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE PROCEDURE [dbo].[sp_ModifyElementSequence] @userName varchar(150),
	@softwareVersion varchar(50),
	@identifier varchar(255),
	@newSequencePosition smallint,
	@testPlanName varchar(255),
	@testPlanRevision int,
	@elementID int output AS BEGIN --http://technet.microsoft.com/en-us/library/aa175920(v=sql.80).aspx
	Declare @ErrorCode int
Select
	@ErrorCode = @@Error IF LTRIM(RTRIM(@userName)) = '' BEGIN RAISERROR ('Empty user name input field.', 16, 1);

RETURN 1;

END IF LTRIM(RTRIM(@softwareVersion)) = '' BEGIN RAISERROR ('Empty software version input field.', 16, 1);

RETURN 2;

END IF LTRIM(RTRIM(@identifier)) = '' BEGIN RAISERROR ('Empty identifier input field.', 16, 1);

RETURN 3;

END IF LTRIM(RTRIM(@testPlanName)) = '' BEGIN RAISERROR ('Empty test plan name input field.', 16, 1);

RETURN 4;

END DECLARE @theTestPlanID int
SELECT
	@theTestPlanID = (
		SELECT
			TestPlanID
		from
			TestPlans
		WHERE
			TestPlans.Name = @testPlanName
			AND TestPlans.Revision = @testPlanRevision
	) IF @theTestPlanID is null BEGIN RAISERROR (
		'Test Plan does not exist with the specified name and revision.',
		16,
		1
	);

RETURN 5;

END DECLARE @theElementID int
SELECT
	@theElementID = (
		SELECT
			ElementID
		from
			Elements
		WHERE
			Elements.Identifier = @identifier
			AND Elements.TestPlanID = @theTestPlanID
	) IF @theElementID is null BEGIN RAISERROR (
		'Element does not exist in the Test Plan with the specified identifier.',
		16,
		1
	);

RETURN 6;

END
SET
	@elementID = @theElementID DECLARE @isReadOnly int EXEC @ErrorCode = sp_IsTestPlanReadOnly @testPlanName,
	@testPlanRevision,
	@isReadOnly = @isReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
		'sp_IsTestPlanReadOnly returned an error code.',
		16,
		1
	);

RETURN @ErrorCode;

END IF 1 = @isReadOnly Begin RAISERROR (
	'Can only modify Elements in the working copy.',
	16,
	1
);

RETURN 7;

End --Make sure the software version is compatible
DECLARE @success bit EXEC @ErrorCode = sp_SoftwareVersionCheck @softwareVersion,
@theTestPlanID,
@success = @success OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_SoftwareVersionCheck returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF @success <> 1 BEGIN RAISERROR ('Failed Software Version check.', 16, 1);

RETURN 8;

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

RETURN 9;

END --Make sure the user exists and has permissions
DECLARE @isUserReadOnly bit EXEC @ErrorCode = sp_IsUserReadOnly @userName,
@isUserReadOnly = @isUserReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_IsUserReadOnly returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF @isUserReadOnly is null BEGIN RAISERROR ('User does not exist.', 16, 1);

RETURN 10;

END IF @isUserReadOnly <> 0
OR @isUserReadOnly is null BEGIN RAISERROR ('User does not have permissions.', 16, 1);

RETURN 11;

END DECLARE @modTime BIGINT
SELECT
	@modTime = (
		SELECT
			DATEDIFF(ss, '1/1/1970 00:00:00', GETUTCDATE())
	) DECLARE @theParentElementID int
SELECT
	@theParentElementID = (
		SELECT
			ParentElementID
		FROM
			Elements
		WHERE
			ElementID = @theElementID
	) IF @theParentElementID is null BEGIN RAISERROR ('Element has invalid parent.', 16, 1);

RETURN 12;

END DECLARE @currentSequence smallint
SELECT
	@currentSequence = (
		SELECT
			Sequence
		from
			Elements
		WHERE
			Elements.ElementID = @theElementID
	) IF @currentSequence is null BEGIN RAISERROR ('Unable to determine current sequence.', 16, 1);

RETURN 13;

END IF @newSequencePosition = @currentSequence BEGIN RAISERROR (
	'Current sequence position is already set at the new sequence position.',
	16,
	1
);

RETURN 14;

END DECLARE @nextAvailable smallint
SELECT
	@nextAvailable = (
		SELECT
			Max(Sequence)
		FROM
			Elements
		WHERE
			Elements.ParentElementID = @theParentElementID
	) IF @nextAvailable is null BEGIN RAISERROR (
		'Unable to determine next available sequence.',
		16,
		1
	);

RETURN 15;

END IF @newSequencePosition < 1 BEGIN RAISERROR (
	'Sequence position cannot be less than 1.',
	16,
	1
);

RETURN 16;

END IF @newSequencePosition > @nextAvailable BEGIN RAISERROR ('Sequence position must be consecutive.', 16, 1);

RETURN 17;

END DECLARE @tempSequence smallint
SET
	@tempSequence = @nextAvailable + 2 -------------------------------------------------------------------------------------------------
	--ALTER TABLE Elements DISABLE TRIGGER Elements_Modify_Constraints
SET
	Context_Info 0x55555 -------------------------------------------------------------------------------------------------
	----START TRANSACTION----------------------------
	Declare @TransactionCountOnEntry int If @ErrorCode = 0 Begin
Select
	@TransactionCountOnEntry = @@TranCount BEGIN TRANSACTION
End -----------------------------------------------
--set the element that we're modifying to a temp value
If @ErrorCode = 0 Begin
UPDATE
	Elements
SET
	Sequence = @tempSequence
WHERE
	ElementID = @theElementID
Select
	@ErrorCode = @@Error
END --Moving down
IF @newSequencePosition < @currentSequence BEGIN If @ErrorCode = 0 Begin
Update
	Elements
set
	Elements.UserID = @theUserID
where
	Sequence BETWEEN @newSequencePosition
	and @currentSequence -1
	AND Elements.ParentElementID = @theParentElementID
Select
	@ErrorCode = @@Error
END If @ErrorCode = 0 Begin
Update
	Elements
set
	Elements.ModificationTime = @modTime
where
	Sequence BETWEEN @newSequencePosition
	and @currentSequence -1
	AND Elements.ParentElementID = @theParentElementID
Select
	@ErrorCode = @@Error
END If @ErrorCode = 0 Begin
Update
	Elements
set
	Sequence = Sequence + 1
where
	Sequence BETWEEN @newSequencePosition
	and @currentSequence -1
	AND Elements.ParentElementID = @theParentElementID
Select
	@ErrorCode = @@Error
END
END --Moving up
IF @newSequencePosition > @currentSequence BEGIN If @ErrorCode = 0 Begin
Update
	Elements
set
	Elements.UserID = @theUserID
where
	Sequence between @currentSequence + 1
	and @newSequencePosition
	AND Elements.ParentElementID = @theParentElementID
Select
	@ErrorCode = @@Error
END If @ErrorCode = 0 Begin
Update
	Elements
set
	Elements.ModificationTime = @modTime
where
	Sequence between @currentSequence + 1
	and @newSequencePosition
	AND Elements.ParentElementID = @theParentElementID
Select
	@ErrorCode = @@Error
END If @ErrorCode = 0 Begin
Update
	Elements
set
	Sequence = Sequence -1
where
	Sequence between @currentSequence + 1
	and @newSequencePosition
	AND Elements.ParentElementID = @theParentElementID
Select
	@ErrorCode = @@Error
END
END If @ErrorCode = 0 Begin
UPDATE
	Elements
SET
	Sequence = @newSequencePosition
WHERE
	ElementID = @theElementID
Select
	@ErrorCode = @@Error
END If @ErrorCode = 0 Begin
UPDATE
	Elements
SET
	Elements.ModificationTime = @modTime
WHERE
	Elements.ElementID = @theElementID
Select
	@ErrorCode = @@Error
END If @ErrorCode = 0 Begin
UPDATE
	Elements
SET
	Elements.UserID = @theUserID
WHERE
	Elements.ElementID = @theElementID
Select
	@ErrorCode = @@Error
END If @ErrorCode = 0 Begin
UPDATE
	TestPlans
SET
	TestPlans.SoftwareVersion = @softwareVersion
WHERE
	TestPlans.TestPlanID = @theTestPlanID
Select
	@ErrorCode = @@Error
END ----END TRANSACTION----------------------------
If @@TranCount > @TransactionCountOnEntry Begin If @ErrorCode = 0 COMMIT TRANSACTION
Else ROLLBACK TRANSACTION
End -----------------------------------------------
-------------------------------------------------------------------------------------------------
--ALTER TABLE Elements ENABLE TRIGGER Elements_Modify_Constraints
SET
	Context_Info 0x0 -------------------------------------------------------------------------------------------------
	Return @ErrorCode
END
GO
	/****** Object:  StoredProcedure [dbo].[sp_ModifyProperty]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE PROCEDURE [dbo].[sp_ModifyProperty] @userName varchar(150),
	@softwareVersion varchar(50),
	@elementIdentifier varchar(255),
	@propertyName varchar(255),
	@propertyValue varchar(MAX),
	@propertyDescription varchar(MAX),
	@testPlanName varchar(255),
	@testPlanRevision int,
	@propertyID int output AS BEGIN --http://technet.microsoft.com/en-us/library/aa175920(v=sql.80).aspx
	Declare @ErrorCode int
Select
	@ErrorCode = @@Error IF LTRIM(RTRIM(@userName)) = '' BEGIN RAISERROR ('Empty user name input field.', 16, 1);

RETURN 1;

END IF LTRIM(RTRIM(@softwareVersion)) = '' BEGIN RAISERROR ('Empty software version input field.', 16, 1);

RETURN 2;

END IF LTRIM(RTRIM(@elementIdentifier)) = '' BEGIN RAISERROR ('Empty element identifier input field.', 16, 1);

RETURN 3;

END IF LTRIM(RTRIM(@propertyName)) = '' BEGIN RAISERROR ('Empty property name input field.', 16, 1);

RETURN 4;

END IF LTRIM(RTRIM(@testPlanName)) = '' BEGIN RAISERROR ('Empty test plan name input field.', 16, 1);

RETURN 5;

END DECLARE @theTestPlanID int
SELECT
	@theTestPlanID = (
		SELECT
			TestPlanID
		from
			TestPlans
		WHERE
			TestPlans.Name = @testPlanName
			AND TestPlans.Revision = @testPlanRevision
	) IF @theTestPlanID is null BEGIN RAISERROR (
		'Test Plan does not exist with the specified name and revision.',
		16,
		1
	);

RETURN 6;

END DECLARE @isReadOnly int EXEC @ErrorCode = sp_IsTestPlanReadOnly @testPlanName,
@testPlanRevision,
@isReadOnly = @isReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_IsTestPlanReadOnly returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF 1 = @isReadOnly Begin RAISERROR (
	'Can only create properties in the working copy.',
	16,
	1
);

RETURN 7;

End --Make sure the software version is compatible
DECLARE @success bit EXEC @ErrorCode = sp_SoftwareVersionCheck @softwareVersion,
@theTestPlanID,
@success = @success OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_SoftwareVersionCheck returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF @success <> 1 BEGIN RAISERROR ('Failed Software Version check.', 16, 1);

RETURN 8;

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

RETURN 9;

END --Make sure the user exists and has permissions
DECLARE @isUserReadOnly bit EXEC @ErrorCode = sp_IsUserReadOnly @userName,
@isUserReadOnly = @isUserReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_IsUserReadOnly returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF @isUserReadOnly is null BEGIN RAISERROR ('User does not exist.', 16, 1);

RETURN 10;

END IF @isUserReadOnly <> 0
OR @isUserReadOnly is null BEGIN RAISERROR ('User does not have permissions.', 16, 1);

RETURN 11;

END DECLARE @elementID int
SELECT
	@elementID = (
		SELECT
			ElementID
		FROM
			Elements
		WHERE
			Identifier = @elementIdentifier
			AND TestPlanID = @theTestPlanID
	) IF @elementID is null BEGIN RAISERROR (
		'Element does not exist with the specified identifier.',
		16,
		1
	);

RETURN 12;

END
SELECT
	@propertyID = (
		SELECT
			PropertyID
		FROM
			Properties
		WHERE
			Name = @propertyName
			AND ElementID = @elementID
	) IF @propertyID is null BEGIN RAISERROR (
		'Property does not exist with the specified name.',
		16,
		1
	);

RETURN 12;

END DECLARE @modTime BIGINT
SELECT
	@modTime = (
		SELECT
			DATEDIFF(ss, '1/1/1970 00:00:00', GETUTCDATE())
	) ----START TRANSACTION----------------------------
	Declare @TransactionCountOnEntry int If @ErrorCode = 0 Begin
Select
	@TransactionCountOnEntry = @@TranCount BEGIN TRANSACTION
End -----------------------------------------------
IF @propertyValue is not null BEGIN If @ErrorCode = 0 BEGIN
UPDATE
	Properties
SET
	Properties.Value = @propertyValue
WHERE
	PropertyID = @propertyID
Select
	@ErrorCode = @@Error
END
END IF @propertyDescription is not null BEGIN If @ErrorCode = 0 BEGIN
UPDATE
	Properties
SET
	Properties.Description = @propertyDescription
WHERE
	PropertyID = @propertyID
Select
	@ErrorCode = @@Error
END
END If @ErrorCode = 0 BEGIN
UPDATE
	Properties
SET
	ModificationTime = @modTime
WHERE
	PropertyID = @propertyID
Select
	@ErrorCode = @@Error
END if @ErrorCode = 0 BEGIN
UPDATE
	Properties
SET
	UserID = @theUserID
WHERE
	PropertyID = @propertyID
Select
	@ErrorCode = @@Error
END If @ErrorCode = 0 BEGIN
UPDATE
	Elements
SET
	ModificationTime = @modTime
WHERE
	ElementID = @elementID
Select
	@ErrorCode = @@Error
END if @ErrorCode = 0 BEGIN
UPDATE
	Elements
SET
	UserID = @theUserID
WHERE
	ElementID = @elementID
Select
	@ErrorCode = @@Error
END If @ErrorCode = 0 BEGIN
UPDATE
	TestPlans
SET
	TestPlans.SoftwareVersion = @softwareVersion
WHERE
	TestPlans.TestPlanID = @theTestPlanID
Select
	@ErrorCode = @@Error
END ----END TRANSACTION----------------------------
If @@TranCount > @TransactionCountOnEntry Begin If @ErrorCode = 0 COMMIT TRANSACTION
Else ROLLBACK TRANSACTION
End -----------------------------------------------
Return @ErrorCode
END
GO
	/****** Object:  StoredProcedure [dbo].[sp_MoveElement]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE PROCEDURE [dbo].[sp_MoveElement] @userName varchar(150),
	@softwareVersion varchar(50),
	@identifier varchar(255),
	@newParentIdentifier varchar(255),
	@newSequencePosition smallint,
	@testPlanName varchar(255),
	@testPlanRevision int,
	@elementID int output AS BEGIN --http://technet.microsoft.com/en-us/library/aa175920(v=sql.80).aspx
	Declare @ErrorCode int
Select
	@ErrorCode = @@Error IF LTRIM(RTRIM(@userName)) = '' BEGIN RAISERROR ('Empty user name input field.', 16, 1);

RETURN 1;

END IF LTRIM(RTRIM(@softwareVersion)) = '' BEGIN RAISERROR ('Empty software version input field.', 16, 1);

RETURN 2;

END IF LTRIM(RTRIM(@identifier)) = '' BEGIN RAISERROR ('Empty identifier input field.', 16, 1);

RETURN 3;

END IF LTRIM(RTRIM(@newParentIdentifier)) = '' BEGIN RAISERROR (
	'Empty new parent identifier input field.',
	16,
	1
);

RETURN 4;

END IF LTRIM(RTRIM(@testPlanName)) = '' BEGIN RAISERROR ('Empty test plan name input field.', 16, 1);

RETURN 5;

END IF @newSequencePosition < 1 BEGIN RAISERROR (
	'Sequence position must be grater than zero.',
	16,
	1
);

RETURN 6;

END DECLARE @theTestPlanID int
SELECT
	@theTestPlanID = (
		SELECT
			TestPlanID
		from
			TestPlans
		WHERE
			TestPlans.Name = @testPlanName
			AND TestPlans.Revision = @testPlanRevision
	) IF @theTestPlanID is null BEGIN RAISERROR (
		'Test Plan does not exist with the specified name and revision.',
		16,
		1
	);

RETURN 7;

END DECLARE @theElementID int
SELECT
	@theElementID = (
		SELECT
			ElementID
		from
			Elements
		WHERE
			Elements.Identifier = @identifier
			AND Elements.TestPlanID = @theTestPlanID
	) IF @theElementID is null BEGIN RAISERROR (
		'Element does not exist in the Test Plan with the specified identifier.',
		16,
		1
	);

RETURN 8;

END
SET
	@elementID = @theElementID DECLARE @isReadOnly int EXEC @ErrorCode = sp_IsTestPlanReadOnly @testPlanName,
	@testPlanRevision,
	@isReadOnly = @isReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
		'sp_IsTestPlanReadOnly returned an error code.',
		16,
		1
	);

RETURN @ErrorCode
END IF 1 = @isReadOnly Begin RAISERROR (
	'Can only modify Elements in the working copy.',
	16,
	1
);

RETURN 9;

End --Make sure the software version is compatible
DECLARE @success bit EXEC @ErrorCode = sp_SoftwareVersionCheck @softwareVersion,
@theTestPlanID,
@success = @success OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_SoftwareVersionCheck returned an error code.',
	16,
	1
);

RETURN @ErrorCode
END IF @success <> 1 BEGIN RAISERROR ('Failed Software Version check.', 16, 1);

RETURN 10;

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

RETURN 11;

END --Make sure the user exists and has permissions
DECLARE @isUserReadOnly bit EXEC @ErrorCode = sp_IsUserReadOnly @userName,
@isUserReadOnly = @isUserReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_IsUserReadOnly returned an error code.',
	16,
	1
);

RETURN @ErrorCode
END IF @isUserReadOnly is null BEGIN RAISERROR ('User does not exist.', 16, 1);

RETURN 12;

END IF @isUserReadOnly <> 0
OR @isUserReadOnly is null BEGIN RAISERROR ('User does not have permissions.', 16, 1);

RETURN 13;

END DECLARE @currentParentElementID int
SELECT
	@currentParentElementID = (
		SELECT
			ParentElementID
		FROM
			Elements
		WHERE
			ElementID = @theElementID
	) DECLARE @newParentElementID int
SELECT
	@newParentElementID = (
		SELECT
			ElementID
		FROM
			Elements
		WHERE
			Identifier = @newParentIdentifier
			AND Elements.TestPlanID = @theTestPlanID
	) IF @newParentElementID is null BEGIN RAISERROR (
		'The new parent identifier must be from the same Test Plan.',
		16,
		1
	);

RETURN 14;

END IF @currentParentElementID = @newParentElementID BEGIN RAISERROR (
	'You cannot move an element within the same parent. Use sp_ModifyElementSequence instead.',
	16,
	1
);

RETURN 15;

END --Parent types must match
DECLARE @currentParentType int DECLARE @newParentType int
SELECT
	@currentParentType = (
		SELECT
			ElementTypeID
		FROM
			Elements
		WHERE
			ElementID = @currentParentElementID
	)
SELECT
	@newParentType = (
		SELECT
			ElementTypeID
		FROM
			Elements
		WHERE
			ElementID = @newParentElementID
	) IF @currentParentType <> @newParentType BEGIN RAISERROR (
		'An element can only be moved to a new parent whose type matches the current parent.',
		16,
		1
	);

RETURN 16;

END DECLARE @oldSequence smallint
SELECT
	@oldSequence = (
		SELECT
			Sequence
		FROM
			Elements
		WHERE
			ElementID = @theElementID
	) DECLARE @tempSequence smallint --Find a sequence position that is greater than the max in both the current parent and new parent
	DECLARE @maxSequenceNew smallint
SELECT
	@maxSequenceNew = (
		SELECT
			Max(Sequence)
		FROM
			Elements
		WHERE
			Elements.ParentElementID = @newParentElementID
	) IF @maxSequenceNew is null BEGIN
SET
	@maxSequenceNew = 1
END DECLARE @maxSequenceCurrent smallint
SELECT
	@maxSequenceCurrent = (
		SELECT
			Max(Sequence)
		FROM
			Elements
		WHERE
			Elements.ParentElementID = @currentParentElementID
	) IF @maxSequenceCurrent is null BEGIN
SET
	@maxSequenceCurrent = 1
END IF @maxSequenceNew >= @maxSequenceCurrent BEGIN
SET
	@tempSequence = @maxSequenceNew + 2
END
ELSE BEGIN
SET
	@tempSequence = @maxSequenceCurrent + 2
END IF @newSequencePosition > @maxSequenceNew + 1 BEGIN RAISERROR ('Sequence position must be consecutive.', 16, 1);

RETURN 17;

END DECLARE @modTime BIGINT
SELECT
	@modTime = (
		SELECT
			DATEDIFF(ss, '1/1/1970 00:00:00', GETUTCDATE())
	) -------------------------------------------------------------------------------------------------
	--ALTER TABLE Elements DISABLE TRIGGER Elements_Modify_Constraints
SET
	Context_Info 0x55555 -------------------------------------------------------------------------------------------------
	----START TRANSACTION----------------------------
	Declare @TransactionCountOnEntry int If @ErrorCode = 0 Begin
Select
	@TransactionCountOnEntry = @@TranCount BEGIN TRANSACTION
End -----------------------------------------------
If @ErrorCode = 0 Begin --Temporarily set the sequence to an unsued position while we change the parent
UPDATE
	Elements
SET
	Sequence = @tempSequence
WHERE
	ElementID = @theElementID
Select
	@ErrorCode = @@Error
End If @ErrorCode = 0 Begin --Change the parent
UPDATE
	Elements
Set
	ParentElementID = @newParentElementID
WHERE
	ElementID = @theElementID
Select
	@ErrorCode = @@Error
End --Now set the element to the max (put it at the end of the new parents children) plus a buffer position
DECLARE @currentSequence smallint
SET
	@currentSequence = @maxSequenceNew + 2 If @ErrorCode = 0 Begin
UPDATE
	Elements
SET
	Sequence = @currentSequence
WHERE
	ElementID = @theElementID
Select
	@ErrorCode = @@Error
End --Moving down
IF @newSequencePosition < @currentSequence BEGIN If @ErrorCode = 0 Begin
UPDATE
	Elements
set
	Elements.ModificationTime = @modTime
where
	Sequence BETWEEN @newSequencePosition
	and @currentSequence -1
	AND Elements.ParentElementID = @newParentElementID
Select
	@ErrorCode = @@Error
End If @ErrorCode = 0 Begin
UPDATE
	Elements
set
	Elements.UserID = @theUserID
where
	Sequence BETWEEN @newSequencePosition
	and @currentSequence -1
	AND Elements.ParentElementID = @newParentElementID
Select
	@ErrorCode = @@Error
End If @ErrorCode = 0 Begin
UPDATE
	Elements
set
	Sequence = Sequence + 1
where
	Sequence BETWEEN @newSequencePosition
	and @currentSequence -1
	AND Elements.ParentElementID = @newParentElementID
Select
	@ErrorCode = @@Error
End
END --Moving up-
IF @newSequencePosition > @currentSequence BEGIN If @ErrorCode = 0 Begin
UPDATE
	Elements
set
	Elements.ModificationTime = @modTime
where
	Sequence between @currentSequence + 1
	and @newSequencePosition
	AND Elements.ParentElementID = @newParentElementID
Select
	@ErrorCode = @@Error
end If @ErrorCode = 0 Begin
UPDATE
	Elements
set
	Elements.UserID = @theUserID
where
	Sequence between @currentSequence + 1
	and @newSequencePosition
	AND Elements.ParentElementID = @newParentElementID
Select
	@ErrorCode = @@Error
end If @ErrorCode = 0 Begin
UPDATE
	Elements
set
	Sequence = Sequence -1
where
	Sequence between @currentSequence + 1
	and @newSequencePosition
	AND Elements.ParentElementID = @newParentElementID
Select
	@ErrorCode = @@Error
end
END If @ErrorCode = 0 Begin
UPDATE
	Elements
SET
	Sequence = @newSequencePosition
WHERE
	ElementID = @theElementID
Select
	@ErrorCode = @@Error
End --Now, in the old parent, re-sequence the former siblings to take up the space left by the child that moved
IF @maxSequenceCurrent <> 1 BEGIN If @ErrorCode = 0 Begin
UPDATE
	Elements
set
	Elements.ModificationTime = @modTime
where
	Sequence between @oldSequence + 1
	and @maxSequenceCurrent
	AND Elements.ParentElementID = @currentParentElementID
Select
	@ErrorCode = @@Error
End If @ErrorCode = 0 Begin
UPDATE
	Elements
set
	Elements.UserID = @theUserID
where
	Sequence between @oldSequence + 1
	and @maxSequenceCurrent
	AND Elements.ParentElementID = @currentParentElementID
Select
	@ErrorCode = @@Error
End If @ErrorCode = 0 Begin
UPDATE
	Elements
set
	Sequence = Sequence - 1
where
	Sequence between @oldSequence + 1
	and @maxSequenceCurrent
	AND Elements.ParentElementID = @currentParentElementID
Select
	@ErrorCode = @@Error
End
END If @ErrorCode = 0 Begin
UPDATE
	Elements
SET
	Elements.ModificationTime = @modTime
WHERE
	Elements.ElementID = @theElementID
Select
	@ErrorCode = @@Error
End If @ErrorCode = 0 Begin
UPDATE
	Elements
SET
	Elements.UserID = @theUserID
WHERE
	Elements.ElementID = @theElementID
Select
	@ErrorCode = @@Error
End If @ErrorCode = 0 Begin
UPDATE
	TestPlans
SET
	TestPlans.SoftwareVersion = @softwareVersion
WHERE
	TestPlans.TestPlanID = @theTestPlanID
Select
	@ErrorCode = @@Error
End ----END TRANSACTION----------------------------
If @@TranCount > @TransactionCountOnEntry Begin If @ErrorCode = 0 COMMIT TRANSACTION
Else ROLLBACK TRANSACTION
End -----------------------------------------------
-------------------------------------------------------------------------------------------------
--ALTER TABLE Elements ENABLE TRIGGER Elements_Modify_Constraints
SET
	Context_Info 0x0 -------------------------------------------------------------------------------------------------
	Return @ErrorCode
END
GO
	/****** Object:  StoredProcedure [dbo].[sp_NewElement]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE PROCEDURE [dbo].[sp_NewElement] @userName varchar(150),
	@softwareVersion varchar(50),
	@type varchar(150),
	@identifier varchar(255),
	@parentIdentifier varchar(255),
	@testPlanName varchar(255),
	@testPlanRevision int,
	@elementID int output AS BEGIN --http://technet.microsoft.com/en-us/library/aa175920(v=sql.80).aspx
	Declare @ErrorCode int
Select
	@ErrorCode = @@Error IF LTRIM(RTRIM(@userName)) = '' BEGIN RAISERROR ('Empty user name input field.', 16, 1);

RETURN 1;

END IF LTRIM(RTRIM(@softwareVersion)) = '' BEGIN RAISERROR ('Empty software version input field.', 16, 1);

RETURN 2;

END IF LTRIM(RTRIM(@type)) = '' BEGIN RAISERROR ('Empty type input field.', 16, 1);

RETURN 3;

END IF LTRIM(RTRIM(@identifier)) = '' BEGIN RAISERROR ('Empty identifier input field.', 16, 1);

RETURN 4;

END IF @parentIdentifier is not null BEGIN IF LTRIM(RTRIM(@parentIdentifier)) = '' BEGIN RAISERROR ('Empty parent identifier input field.', 16, 1);

RETURN 5;

END
END IF LTRIM(RTRIM(@testPlanName)) = '' BEGIN RAISERROR ('Empty test plan name input field.', 16, 1);

RETURN 6;

END --Don't allow root elements to be created again.  spNewTestPlan is responsible for creating these when a new test plan is created.
DECLARE @trimmedType varchar(150)
SET
	@trimmedType = LTRIM(RTRIM(@type)) IF @trimmedType = 'TestPlan'
	OR @trimmedType = 'Requirements'
	OR @trimmedType = 'Tests'
	OR @trimmedType = 'Fixturing'
	OR @trimmedType = 'Flow' BEGIN RAISERROR ('Cannot create root test plan elements.', 16, 1);

RETURN 7;

END DECLARE @theTestPlanID int
SELECT
	@theTestPlanID = (
		SELECT
			TestPlanID
		from
			TestPlans
		WHERE
			TestPlans.Name = @testPlanName
			AND TestPlans.Revision = @testPlanRevision
	) IF @theTestPlanID is null BEGIN RAISERROR (
		'Test Plan does not exist with the specified name and revision.',
		16,
		1
	);

RETURN 8;

END DECLARE @isReadOnly int EXEC @ErrorCode = sp_IsTestPlanReadOnly @testPlanName,
@testPlanRevision,
@isReadOnly = @isReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_IsTestPlanReadOnly returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF 1 = @isReadOnly Begin RAISERROR (
	'Can only create Elements in the working copy.',
	16,
	1
);

RETURN 9;

End --Make sure the software version is compatible
DECLARE @success bit EXEC @ErrorCode = sp_SoftwareVersionCheck @softwareVersion,
@theTestPlanID,
@success = @success OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_SoftwareVersionCheck returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF @success <> 1 BEGIN RAISERROR ('Failed Software Version check.', 16, 1);

RETURN 10;

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

RETURN 11;

END --Make sure the user exists and has permissions
DECLARE @isUserReadOnly bit EXEC @ErrorCode = sp_IsUserReadOnly @userName,
@isUserReadOnly = @isUserReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_IsUserReadOnly returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF @isUserReadOnly is null BEGIN RAISERROR ('User does not exist.', 16, 1);

RETURN 12;

END IF @isUserReadOnly <> 0
OR @isUserReadOnly is null BEGIN RAISERROR ('User does not have permissions.', 16, 1);

RETURN 13;

END DECLARE @parentElementID int IF @parentIdentifier is null BEGIN BEGIN RAISERROR ('Parent element cannot be null.', 16, 1);

RETURN 14;

END
END
ELSE BEGIN
SELECT
	@parentElementID = (
		SELECT
			ElementID
		FROM
			Elements
		WHERE
			Identifier = @parentIdentifier
			AND TestPlanID = @theTestPlanID
	) IF @parentElementID is null BEGIN RAISERROR ('Parent element does not exist.', 16, 1);

RETURN 15;

END
END DECLARE @typeID int
SELECT
	@typeID = (
		SELECT
			ElementTypeID
		FROM
			ElementTypes
		WHERE
			Type = @type
	) IF @typeID is null BEGIN RAISERROR ('Invalid element type.', 16, 1);

RETURN 16;

END DECLARE @modTime BIGINT
SELECT
	@modTime = (
		SELECT
			DATEDIFF(ss, '1/1/1970 00:00:00', GETUTCDATE())
	) DECLARE @lastSequencePosition int
SELECT
	@lastSequencePosition = MAX(Sequence)
from
	Elements
WHERE
	ParentElementID = @parentElementID IF @lastSequencePosition is null BEGIN
SET
	@lastSequencePosition = 1
END
ELSE BEGIN
SET
	@lastSequencePosition = @lastSequencePosition + 1
END ----START TRANSACTION----------------------------
Declare @TransactionCountOnEntry int If @ErrorCode = 0 Begin
Select
	@TransactionCountOnEntry = @@TranCount BEGIN TRANSACTION
End -----------------------------------------------
If @ErrorCode = 0 BEGIN
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
		@identifier,
		@identifier,
		@lastSequencePosition,
		@theTestPlanID,
		@typeID,
		@parentElementID,
		@modTime,
		@theUserID
	)
SELECT
	@elementID = (
		SELECT
			SCOPE_IDENTITY()
	),
	@ErrorCode = @@Error
END If @ErrorCode = 0 BEGIN
UPDATE
	TestPlans
SET
	TestPlans.SoftwareVersion = @softwareVersion
WHERE
	TestPlans.TestPlanID = @theTestPlanID
Select
	@ErrorCode = @@Error
END ----END TRANSACTION----------------------------
If @@TranCount > @TransactionCountOnEntry Begin If @ErrorCode = 0 COMMIT TRANSACTION
Else ROLLBACK TRANSACTION
End -----------------------------------------------
Return @ErrorCode
END
GO
	/****** Object:  StoredProcedure [dbo].[sp_NewEmptyWorkingCopy]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE PROCEDURE [dbo].[sp_NewEmptyWorkingCopy] @userName varchar(150),
	@softwareVersion varchar(50),
	@name varchar(255),
	@testPlanID int output AS BEGIN --http://technet.microsoft.com/en-us/library/aa175920(v=sql.80).aspx
	Declare @ErrorCode int
Select
	@ErrorCode = @@Error IF LTRIM(RTRIM(@userName)) = '' BEGIN RAISERROR ('Empty user name input field.', 16, 1);

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
	) --The current working copy revision
	DECLARE @currentWorkingCopyRevision int
SELECT
	@currentWorkingCopyRevision = MAX(Revision)
from
	TestPlans
WHERE
	TestPlans.Name = @name IF @currentWorkingCopyRevision is null BEGIN RAISERROR (
		'Working copy revision does not exist for the Test Plan with the specified name.',
		16,
		1
	);

RETURN 7;

END --Calculate next available revision
DECLARE @newWorkingRevision int
SET
	@newWorkingRevision = @currentWorkingCopyRevision + 1 ----START TRANSACTION----------------------------
	Declare @TransactionCountOnEntry int If @ErrorCode = 0 Begin
Select
	@TransactionCountOnEntry = @@TranCount BEGIN TRANSACTION
End -----------------------------------------------
--Create the Test Plan
If @ErrorCode = 0 BEGIN
INSERT INTO
	TestPlans (Revision, Name, RevisionLabel, SoftwareVersion)
VALUES
	(
		@newWorkingRevision,
		@name,
		'',
		@softwareVersion
	)
SELECT
	@testPlanID = (
		SELECT
			SCOPE_IDENTITY()
	),
	@ErrorCode = @@Error
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
	@ErrorCode = @@Error
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
	@ErrorCode = @@Error
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
	@ErrorCode = @@Error
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
	@ErrorCode = @@Error
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
	@ErrorCode = @@Error
END ----END TRANSACTION----------------------------
If @@TranCount > @TransactionCountOnEntry Begin If @ErrorCode = 0 COMMIT TRANSACTION
Else ROLLBACK TRANSACTION
End -----------------------------------------------
END Return @ErrorCode
END
GO
	/****** Object:  StoredProcedure [dbo].[sp_NewProperty]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE PROCEDURE [dbo].[sp_NewProperty] @userName varchar(150),
	@softwareVersion varchar(50),
	@elementIdentifier varchar(255),
	@propertyName varchar(255),
	@propertyType varchar(150),
	@testPlanName varchar(255),
	@testPlanRevision int,
	@propertyID int output AS BEGIN --http://technet.microsoft.com/en-us/library/aa175920(v=sql.80).aspx
	Declare @ErrorCode int
Select
	@ErrorCode = @@Error IF LTRIM(RTRIM(@userName)) = '' BEGIN RAISERROR ('Empty user name input field.', 16, 1);

RETURN 1;

END IF LTRIM(RTRIM(@softwareVersion)) = '' BEGIN RAISERROR ('Empty software version input field.', 16, 1);

RETURN 2;

END IF LTRIM(RTRIM(@elementIdentifier)) = '' BEGIN RAISERROR ('Empty element identifier input field.', 16, 1);

RETURN 3;

END IF LTRIM(RTRIM(@propertyName)) = '' BEGIN RAISERROR ('Empty property name input field.', 16, 1);

RETURN 4;

END IF LTRIM(RTRIM(@propertyType)) = '' BEGIN RAISERROR ('Empty property type input field.', 16, 1);

RETURN 5;

END IF LTRIM(RTRIM(@testPlanName)) = '' BEGIN RAISERROR ('Empty test plan name input field.', 16, 1);

RETURN 6;

END DECLARE @theTestPlanID int
SELECT
	@theTestPlanID = (
		SELECT
			TestPlanID
		from
			TestPlans
		WHERE
			TestPlans.Name = @testPlanName
			AND TestPlans.Revision = @testPlanRevision
	) IF @theTestPlanID is null BEGIN RAISERROR (
		'Test Plan does not exist with the specified name and revision.',
		16,
		1
	);

RETURN 7;

END DECLARE @isReadOnly int EXEC @ErrorCode = sp_IsTestPlanReadOnly @testPlanName,
@testPlanRevision,
@isReadOnly = @isReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_IsTestPlanReadOnly returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF 1 = @isReadOnly Begin RAISERROR (
	'Can only create properties in the working copy.',
	16,
	1
);

RETURN 8;

End --Make sure the software version is compatible
DECLARE @success bit EXEC @ErrorCode = sp_SoftwareVersionCheck @softwareVersion,
@theTestPlanID,
@success = @success OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_SoftwareVersionCheck returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF @success <> 1 BEGIN RAISERROR ('Failed Software Version check.', 16, 1);

RETURN 9;

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

RETURN 10;

END --Make sure the user exists and has permissions
DECLARE @isUserReadOnly bit EXEC @ErrorCode = sp_IsUserReadOnly @userName,
@isUserReadOnly = @isUserReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_IsUserReadOnly returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF @isUserReadOnly is null BEGIN RAISERROR ('User does not exist.', 16, 1);

RETURN 11;

END IF @isUserReadOnly <> 0
OR @isUserReadOnly is null BEGIN RAISERROR ('User does not have permissions.', 16, 1);

RETURN 12;

END DECLARE @elementID int
SELECT
	@elementID = (
		SELECT
			ElementID
		FROM
			Elements
		WHERE
			Identifier = @elementIdentifier
			AND TestPlanID = @theTestPlanID
	) IF @elementID is null BEGIN RAISERROR (
		'Element does not exist with the specified identifier.',
		16,
		1
	);

RETURN 13;

END DECLARE @typeID int
SELECT
	@typeID = (
		SELECT
			PropertyTypeID
		FROM
			PropertyTypes
		WHERE
			Type = @propertyType
	) IF @typeID is null BEGIN RAISERROR ('Invalid property type.', 16, 1);

RETURN 14;

END DECLARE @modTime BIGINT
SELECT
	@modTime = (
		SELECT
			DATEDIFF(ss, '1/1/1970 00:00:00', GETUTCDATE())
	) ----START TRANSACTION----------------------------
	Declare @TransactionCountOnEntry int If @ErrorCode = 0 Begin
Select
	@TransactionCountOnEntry = @@TranCount BEGIN TRANSACTION
End -----------------------------------------------
If @ErrorCode = 0 BEGIN
INSERT INTO
	Properties (
		Value,
		Name,
		ElementID,
		PropertyTypeID,
		Description,
		ModificationTime,
		UserID
	)
VALUES
	(
		'',
		@propertyName,
		@elementID,
		@typeID,
		'',
		@modTime,
		@theUserID
	)
SELECT
	@propertyID = (
		SELECT
			SCOPE_IDENTITY()
	),
	@ErrorCode = @@Error
END If @ErrorCode = 0 BEGIN
UPDATE
	Elements
SET
	ModificationTime = @modTime
WHERE
	ElementID = @elementID
Select
	@ErrorCode = @@Error
END if @ErrorCode = 0 BEGIN
UPDATE
	Elements
SET
	UserID = @theUserID
WHERE
	ElementID = @elementID
Select
	@ErrorCode = @@Error
END If @ErrorCode = 0 BEGIN
UPDATE
	TestPlans
SET
	TestPlans.SoftwareVersion = @softwareVersion
WHERE
	TestPlans.TestPlanID = @theTestPlanID
Select
	@ErrorCode = @@Error
END ----END TRANSACTION----------------------------
If @@TranCount > @TransactionCountOnEntry Begin If @ErrorCode = 0 COMMIT TRANSACTION
Else ROLLBACK TRANSACTION
End -----------------------------------------------
Return @ErrorCode
END
GO
	/****** Object:  StoredProcedure [dbo].[sp_NewTag]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE PROCEDURE [dbo].[sp_NewTag] @userName varchar(150),
	@softwareVersion varchar(50),
	@elementIdentifier varchar(255),
	@tagName varchar(150),
	@testPlanName varchar(255),
	@testPlanRevision int,
	@tagID int output AS BEGIN --http://technet.microsoft.com/en-us/library/aa175920(v=sql.80).aspx
	Declare @ErrorCode int
Select
	@ErrorCode = @@Error IF LTRIM(RTRIM(@userName)) = '' BEGIN RAISERROR ('Empty user name input field.', 16, 1);

RETURN 1;

END IF LTRIM(RTRIM(@softwareVersion)) = '' BEGIN RAISERROR ('Empty software version input field.', 16, 1);

RETURN 2;

END IF LTRIM(RTRIM(@elementIdentifier)) = '' BEGIN RAISERROR ('Empty element identifier input field.', 16, 1);

RETURN 3;

END IF LTRIM(RTRIM(@tagName)) = '' BEGIN RAISERROR ('Empty tag name input field.', 16, 1);

RETURN 4;

END IF LTRIM(RTRIM(@testPlanName)) = '' BEGIN RAISERROR ('Empty test plan name input field.', 16, 1);

RETURN 5;

END DECLARE @theTestPlanID int
SELECT
	@theTestPlanID = (
		SELECT
			TestPlanID
		from
			TestPlans
		WHERE
			TestPlans.Name = @testPlanName
			AND TestPlans.Revision = @testPlanRevision
	) IF @theTestPlanID is null BEGIN RAISERROR (
		'Test Plan does not exist with the specified name and revision.',
		16,
		1
	);

RETURN 6;

END DECLARE @isReadOnly int EXEC @ErrorCode = sp_IsTestPlanReadOnly @testPlanName,
@testPlanRevision,
@isReadOnly = @isReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_IsTestPlanReadOnly returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF 1 = @isReadOnly Begin RAISERROR (
	'Can only create tags in the working copy.',
	16,
	1
);

RETURN 7;

End --Make sure the software version is compatible
DECLARE @success bit EXEC @ErrorCode = sp_SoftwareVersionCheck @softwareVersion,
@theTestPlanID,
@success = @success OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_SoftwareVersionCheck returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF @success <> 1 BEGIN RAISERROR ('Failed Software Version check.', 16, 1);

RETURN 8;

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

RETURN 9;

END --Make sure the user exists and has permissions
DECLARE @isUserReadOnly bit EXEC @ErrorCode = sp_IsUserReadOnly @userName,
@isUserReadOnly = @isUserReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_IsUserReadOnly returned an error code.',
	16,
	1
);

RETURN @ErrorCode;

END IF @isUserReadOnly is null BEGIN RAISERROR ('User does not exist.', 16, 1);

RETURN 10;

END IF @isUserReadOnly <> 0
OR @isUserReadOnly is null BEGIN RAISERROR ('User does not have permissions.', 16, 1);

RETURN 11;

END DECLARE @elementID int
SELECT
	@elementID = (
		SELECT
			ElementID
		FROM
			Elements
		WHERE
			Identifier = @elementIdentifier
			AND TestPlanID = @theTestPlanID
	) IF @elementID is null BEGIN RAISERROR (
		'Element does not exist with the specified identifier.',
		16,
		1
	);

RETURN 12;

END DECLARE @modTime BIGINT
SELECT
	@modTime = (
		SELECT
			DATEDIFF(ss, '1/1/1970 00:00:00', GETUTCDATE())
	) ----START TRANSACTION----------------------------
	Declare @TransactionCountOnEntry int If @ErrorCode = 0 Begin
Select
	@TransactionCountOnEntry = @@TranCount BEGIN TRANSACTION
End -----------------------------------------------
--Create the tag name if it doesn't exist
DECLARE @tagNameID int
SELECT
	@tagNameID = (
		SELECT
			TagID
		FROM
			Tags
		WHERE
			Tags.Name = @tagName
	) IF @tagNameID is null BEGIN If @ErrorCode = 0 BEGIN
INSERT INTO
	Tags (Name)
VALUES
	(@tagName)
SELECT
	@tagNameID = (
		SELECT
			SCOPE_IDENTITY()
	),
	@ErrorCode = @@Error
END
END If @ErrorCode = 0 BEGIN
INSERT INTO
	ElementTags (TagID, ElementID)
VALUES
	(@tagNameID, @elementID)
SELECT
	@tagID = (
		SELECT
			SCOPE_IDENTITY()
	),
	@ErrorCode = @@Error
END If @ErrorCode = 0 BEGIN
UPDATE
	Elements
SET
	ModificationTime = @modTime
WHERE
	ElementID = @elementID
Select
	@ErrorCode = @@Error
END if @ErrorCode = 0 BEGIN
UPDATE
	Elements
SET
	UserID = @theUserID
WHERE
	ElementID = @elementID
Select
	@ErrorCode = @@Error
END If @ErrorCode = 0 BEGIN
UPDATE
	TestPlans
SET
	TestPlans.SoftwareVersion = @softwareVersion
WHERE
	TestPlans.TestPlanID = @theTestPlanID
Select
	@ErrorCode = @@Error
END ----END TRANSACTION----------------------------
If @@TranCount > @TransactionCountOnEntry Begin If @ErrorCode = 0 COMMIT TRANSACTION
Else ROLLBACK TRANSACTION
End -----------------------------------------------
Return @ErrorCode
END
GO
	/****** Object:  StoredProcedure [dbo].[sp_NewTestPlan]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE PROCEDURE [dbo].[sp_NewTestPlan] @userName varchar(150),
	@softwareVersion varchar(50),
	@name varchar(255),
	@testPlanID int output AS BEGIN --http://technet.microsoft.com/en-us/library/aa175920(v=sql.80).aspx
	Declare @ErrorCode int
Select
	@ErrorCode = @@Error IF LTRIM(RTRIM(@userName)) = '' BEGIN RAISERROR ('Empty user name input field.', 16, 1);

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
	@TransactionCountOnEntry = @@TranCount BEGIN TRANSACTION
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
	@ErrorCode = @@Error
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
	@ErrorCode = @@Error
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
	@ErrorCode = @@Error
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
	@ErrorCode = @@Error
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
	@ErrorCode = @@Error
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
	@ErrorCode = @@Error
END ----END TRANSACTION----------------------------
If @@TranCount > @TransactionCountOnEntry Begin If @ErrorCode = 0 COMMIT TRANSACTION
Else ROLLBACK TRANSACTION
End -----------------------------------------------
END Return @ErrorCode
END
GO
	/****** Object:  StoredProcedure [dbo].[sp_NewWorkingCopy]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE PROCEDURE [dbo].[sp_NewWorkingCopy] @userName varchar(150),
	@softwareVersion varchar(50),
	@testPlanName varchar(255),
	@testPlanRevision int,
	@logMessage varchar(MAX),
	@newTestPlanID int output AS BEGIN --http://technet.microsoft.com/en-us/library/aa175920(v=sql.80).aspx
	Declare @ErrorCode int
Select
	@ErrorCode = @@Error Declare @localUserName varchar(150)
Select
	@localUserName = @userName Declare @localSoftwareVersion varchar(50)
Select
	@localSoftwareVersion = @softwareVersion Declare @localTestPlanName varchar(255)
Select
	@localTestPlanName = @testPlanName Declare @localTestPlanRevision int
Select
	@localTestPlanRevision = @testPlanRevision Declare @localLogMessage varchar(MAX)
Select
	@localLogMessage = @logMessage IF LTRIM(RTRIM(@localUserName)) = '' BEGIN RAISERROR ('Empty user name input field.', 16, 1);

RETURN 1;

END IF LTRIM(RTRIM(@localSoftwareVersion)) = '' BEGIN RAISERROR ('Empty software version input field.', 16, 1);

RETURN 2;

END IF LTRIM(RTRIM(@localTestPlanName)) = '' BEGIN RAISERROR ('Empty test plan name input field.', 16, 1);

RETURN 3;

END IF LTRIM(RTRIM(@localLogMessage)) = '' BEGIN RAISERROR ('Empty log message input field.', 16, 1);

RETURN 4;

END --Make sure the user exists and has permissions
DECLARE @theUserID int
SET
	@theUserID = (
		SELECT
			UserID
		FROM
			Users
		WHERE
			Name = @localUserName
	) IF @theUserID is null BEGIN RAISERROR ('User does not exist.', 16, 1);

RETURN 5;

END DECLARE @isUserReadOnly bit EXEC @ErrorCode = sp_IsUserReadOnly @localUserName,
@isUserReadOnly = @isUserReadOnly OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_IsUserReadOnly returned an error code.',
	16,
	1
);

RETURN @ErrorCode
END IF @isUserReadOnly is null BEGIN RAISERROR ('User does not exist.', 16, 1);

RETURN 6;

END IF @isUserReadOnly <> 0
OR @isUserReadOnly is null BEGIN RAISERROR ('User does not have permissions.', 16, 1);

RETURN 7;

END --The current working copy revision
DECLARE @currentWorkingCopyRevision int
SELECT
	@currentWorkingCopyRevision = MAX(Revision)
from
	TestPlans
WHERE
	TestPlans.Name = @localTestPlanName IF @currentWorkingCopyRevision is null BEGIN RAISERROR (
		'Test Plan does not exist with the specified name.',
		16,
		1
	);

RETURN 8;

END IF @currentWorkingCopyRevision <> @localTestPlanRevision BEGIN RAISERROR (
	'You can only create a new working copy from the current working copy revision.',
	16,
	1
);

RETURN 9;

END --Calculate next available revision
DECLARE @newWorkingRevision int
SET
	@newWorkingRevision = @currentWorkingCopyRevision + 1 --The current working copy Test Plan ID
	DECLARE @currentWorkingCopyID int
SELECT
	@currentWorkingCopyID = (
		SELECT
			TestPlanID
		from
			TestPlans
		WHERE
			TestPlans.Name = @localTestPlanName
			AND TestPlans.Revision = @currentWorkingCopyRevision
	) IF @currentWorkingCopyID is null BEGIN RAISERROR ('currentWorkingCopyID is null.', 16, 1);

RETURN 10;

END --The current working copy root element
DECLARE @currentRootElementID int
SELECT
	@currentRootElementID = (
		SELECT
			ElementID
		from
			Elements
		WHERE
			Elements.Identifier = 'testplan'
			AND Elements.TestPlanID = @currentWorkingCopyID
	) IF @currentRootElementID is null BEGIN RAISERROR ('currentRootElementID is null.', 16, 1);

RETURN 11;

END --Make sure the software version is compatible
DECLARE @success bit EXEC @ErrorCode = sp_SoftwareVersionCheck @localSoftwareVersion,
@currentWorkingCopyID,
@success = @success OUTPUT IF @ErrorCode <> 0 BEGIN RAISERROR (
	'sp_SoftwareVersionCheck returned an error code.',
	16,
	1
);

RETURN @ErrorCode
END IF @success <> 1 BEGIN RAISERROR ('Failed Software Version check.', 16, 1);

RETURN 12;

END -------------------------------------------------------------------------------------------------
--ALTER TABLE Elements DISABLE TRIGGER Elements_Modify_Constraints
--ALTER TABLE Properties DISABLE TRIGGER Properties_Modify_Constraints
--ALTER TABLE ElementTags DISABLE TRIGGER ElementTags_Insert_Constraints
SET
	Context_Info 0x55555 -------------------------------------------------------------------------------------------------
	DECLARE @modTime BIGINT
SELECT
	@modTime = (
		SELECT
			DATEDIFF(ss, '1/1/1970 00:00:00', GETUTCDATE())
	) ----START TRANSACTION----------------------------
	Declare @TransactionCountOnEntry int If @ErrorCode = 0 Begin
Select
	@TransactionCountOnEntry = @@TranCount BEGIN TRANSACTION
End -----------------------------------------------
--Create a new working copy
If @ErrorCode = 0 BEGIN
INSERT INTO
	TestPlans (Revision, Name, RevisionLabel, SoftwareVersion)
VALUES
	(
		@newWorkingRevision,
		@localTestPlanName,
		'',
		@localSoftwareVersion
	)
SELECT
	@newTestPlanID = (
		SELECT
			SCOPE_IDENTITY()
	),
	@ErrorCode = @@Error
END --Recursively copy the elements and their properties and tags
If @ErrorCode = 0 BEGIN EXEC @ErrorCode = sp_CopyElementRecursive @currentRootElementID,
NULL,
@newTestPlanID
END IF @ErrorCode <> 0 BEGIN
SET
	Context_Info 0x0 RAISERROR (
		'sp_CopyElementRecursive returned an error code.',
		16,
		1
	);

ROLLBACK TRANSACTION Return @ErrorCode;

END --Recursively copy the mappings
If @ErrorCode = 0 BEGIN EXEC @ErrorCode = sp_CopyMappingRecursive @currentRootElementID,
@newTestPlanID
END IF @ErrorCode <> 0 BEGIN
SET
	Context_Info 0x0 RAISERROR (
		'sp_CopyMappingRecursive returned an error code.',
		16,
		1
	);

ROLLBACK TRANSACTION Return @ErrorCode;

END --The new root element
DECLARE @newRootElementID int
SELECT
	@newRootElementID = (
		SELECT
			ElementID
		from
			Elements
		WHERE
			Elements.Identifier = 'testplan'
			AND Elements.TestPlanID = @newTestPlanID
	) IF @newRootElementID is null BEGIN
SET
	Context_Info 0x0 RAISERROR ('newRootElementID is null.', 16, 1);

ROLLBACK TRANSACTION Return 13;

END --Set the userID and modTime on the new root element
If @ErrorCode = 0 BEGIN
UPDATE
	Elements
SET
	Elements.ModificationTime = @modTime,
	Elements.UserID = @theUserID
WHERE
	Elements.ElementID = @newRootElementID
Select
	@ErrorCode = @@Error
END --Create the log entry
If @ErrorCode = 0 BEGIN
INSERT INTO
	Logs (UserID, Message, TestPlanID)
VALUES
	(@theUserID, @localLogMessage, @newTestPlanID)
Select
	@ErrorCode = @@Error
END ----END TRANSACTION----------------------------
If @@TranCount > @TransactionCountOnEntry Begin If @ErrorCode = 0 COMMIT TRANSACTION
Else ROLLBACK TRANSACTION
End -----------------------------------------------
-------------------------------------------------------------------------------------------------
--ALTER TABLE Elements ENABLE TRIGGER Elements_Modify_Constraints
--ALTER TABLE Properties ENABLE TRIGGER Properties_Modify_Constraints
--ALTER TABLE ElementTags ENABLE TRIGGER ElementTags_Insert_Constraints
SET
	Context_Info 0x0 -------------------------------------------------------------------------------------------------
	Return @ErrorCode
END
GO
	/****** Object:  StoredProcedure [dbo].[sp_SoftwareVersionCheck]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE PROCEDURE [dbo].[sp_SoftwareVersionCheck] @softwareVersion varchar(50),
	@testPlanID int,
	@success bit output AS BEGIN --http://technet.microsoft.com/en-us/library/aa175920(v=sql.80).aspx
	Declare @ErrorCode int
Select
	@ErrorCode = @@Error
SET
	@success = 0 IF LTRIM(RTRIM(@softwareVersion)) = '' BEGIN RAISERROR ('Empty software version input field.', 16, 1);

RETURN 1;

END DECLARE @theTestPlanName varchar(max)
SET
	@theTestPlanName = (
		SELECT
			Name
		FROM
			TestPlans
		WHERE
			TestPlans.TestPlanID = @testPlanID
	) IF @theTestPlanName is null BEGIN RAISERROR ('Invalid TestPlanID specified.', 16, 1);

RETURN 2;

END --Passed in version
DECLARE @major int DECLARE @minor int DECLARE @patch int --Version that exists in the Test Plan
DECLARE @vercheckMajor int DECLARE @vercheckMinor int DECLARE @vercheckPatch int DECLARE @vercheck varchar(50)
SET
	@vercheck = (
		SELECT
			SoftwareVersion
		FROM
			TestPlans
		WHERE
			testPlanID = @testPlanID
	) DECLARE @version varchar(50)
SET
	@version = @softwareVersion --Passed in
SET
	@major = (
		SELECT
			PARSENAME(@version, 3)
	)
SET
	@minor = (
		SELECT
			PARSENAME(@version, 2)
	)
SET
	@patch = (
		SELECT
			PARSENAME(@version, 1)
	) --Existing
SET
	@vercheckMajor = (
		SELECT
			PARSENAME(@vercheck, 3)
	)
SET
	@vercheckMinor = (
		SELECT
			PARSENAME(@vercheck, 2)
	)
SET
	@vercheckPatch = (
		SELECT
			PARSENAME(@vercheck, 1)
	) IF @major > @vercheckMajor BEGIN
SET
	@success = 1
END
ELSE BEGIN IF @major = @vercheckMajor BEGIN IF @minor > @vercheckMinor BEGIN
SET
	@success = 1
END
ELSE BEGIN IF @minor = @vercheckMinor BEGIN IF @patch >= @vercheckPatch BEGIN
SET
	@success = 1
END
ELSE BEGIN IF @patch < @vercheckPatch BEGIN
SET
	@success = 0
END
END
END
END
END
END IF @ErrorCode <> 0 BEGIN
SET
	@success = 0
END Return @ErrorCode
END
GO
	/****** Object:  DdlTrigger [DoNotDropTables]    Script Date: 4/21/2020 8:08:10 AM ******/
SET
	ANSI_NULLS ON
GO
SET
	QUOTED_IDENTIFIER ON
GO
	CREATE TRIGGER [DoNotDropTables] ON DATABASE FOR DROP_TABLE AS RAISERROR (
		'Cannot drop tables in the TestPlan database due to trigger.',
		16,
		1
	);

ROLLBACK;

GO
	ENABLE TRIGGER [DoNotDropTables] ON DATABASE
GO