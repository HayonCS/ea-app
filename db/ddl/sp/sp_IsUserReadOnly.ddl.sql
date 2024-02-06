
	CREATE PROCEDURE [dbo].[sp_IsUserReadOnly] @name varchar(150),
	@isUserReadOnly bit output AS BEGIN --http://technet.microsoft.com/en-us/library/aa175920(v=sql.80).aspx
	Declare @ErrorCode int
Select
	@ErrorCode = @@ERROR
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
