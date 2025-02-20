import React, { forwardRef, RefObject, useCallback, useMemo, useRef } from "react";
import cx from "classnames";
import Icon from "../Icon/Icon";
import useMergeRef from "../../hooks/useMergeRef";
import { CloseSmall } from "@vibe/icons";
import { getCSSVar } from "../../services/themes";
import { ElementAllowedColor as ElementAllowedColorEnum } from "../../utils/colors-vars-map";
import { ElementAllowedColor, getElementColor } from "../../types/Colors";
import Avatar from "../Avatar/Avatar";
import IconButton from "../IconButton/IconButton";
import Text from "../Text/Text";
import { ComponentDefaultTestId, getTestId } from "../../tests/test-ids-utils";
import { AvatarType as AvatarTypeEnum } from "../Avatar/AvatarConstants";
import { AvatarType } from "../Avatar/Avatar.types";
import { ElementContent, SubIcon, VibeComponent, VibeComponentProps, withStaticProps } from "../../types";
import useHover from "../../hooks/useHover/useHover";
import useSetFocus from "../../hooks/useSetFocus";
import useClickableProps from "../../hooks/useClickableProps/useClickableProps";
import styles from "./Chips.module.scss";

const CHIPS_AVATAR_SIZE = 18;

export interface ChipsProps extends VibeComponentProps {
  label?: ElementContent;
  disabled?: boolean;
  readOnly?: boolean;
  "data-testid"?: string;
  /**
   * A React element that is positioned to the right of the text
   */
  rightRenderer?: ElementContent;
  /**
   * A React element that is positioned to the left of the text
   */
  leftRenderer?: ElementContent;
  /** Icon to place on the right */
  rightIcon?: SubIcon;
  /** Icon to place on the left */
  leftIcon?: SubIcon;
  /** Img to place as avatar on the right */
  rightAvatar?: string;
  /** the type of right avatar */
  rightAvatarType?: AvatarType;
  /** Img to place as avatar on the left */
  leftAvatar?: string;
  /** the type of left avatar */
  leftAvatarType?: AvatarType;
  /** ClassName for left or right icon */
  iconClassName?: string;
  /** ClassName for left or right avatar */
  avatarClassName?: string;
  color?: Exclude<ElementAllowedColor, "dark_indigo" | "blackish">;
  /** Size for font icon */
  iconSize?: number | string;
  onDelete?: (id: string, event: React.MouseEvent<HTMLSpanElement>) => void;
  /**
   * Disables the Chip's entry animation
   */
  noAnimation?: boolean;
  /**
   * Allow user to select text
   */
  allowTextSelection?: boolean;
  /**
   * Callback function to be called when the user clicks the component.
   */
  onMouseDown?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  /**
   * Callback function to be called when the user clicks the component.
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  /**
   * Applies when element has onClick or onMouseDown props
   */
  ariaLabel?: string;
  /**
   * Disable click behaviors
   */
  disableClickableBehavior?: boolean;
  /**
   * Show border, the border color is `--text-color-on-primary`, should be when the chip is a colored background like
   * selected-color
   */
  showBorder?: boolean;
  closeButtonAriaLabel?: string;
}

const Chips: VibeComponent<ChipsProps, HTMLDivElement> & {
  colors?: typeof ElementAllowedColorEnum;
  avatarTypes?: typeof AvatarTypeEnum;
} = forwardRef<HTMLDivElement, ChipsProps>(
  (
    {
      className,
      avatarClassName,
      iconClassName,
      id,
      label = "",
      leftIcon = null,
      rightIcon = null,
      leftAvatar = null,
      rightAvatar = null,
      disabled = false,
      readOnly = false,
      allowTextSelection = false,
      color = "primary",
      iconSize = 18,
      onDelete = (_id: string, _e: React.MouseEvent<HTMLSpanElement>) => {},
      onMouseDown,
      onClick,
      noAnimation = true,
      ariaLabel,
      "data-testid": dataTestId,
      disableClickableBehavior = false,
      leftAvatarType = "img",
      rightAvatarType = "img",
      showBorder = false,
      leftRenderer,
      rightRenderer,
      closeButtonAriaLabel = "Remove"
    }: ChipsProps,
    ref
  ) => {
    const componentDataTestId = dataTestId || getTestId(ComponentDefaultTestId.CHIP, id);
    const hasClickableWrapper = (!!onClick || !!onMouseDown) && !disableClickableBehavior;
    const hasCloseButton = !readOnly && !disabled;
    const overrideAriaLabel = ariaLabel || (typeof label === "string" && label) || "";

    const iconButtonRef = useRef(null);
    const componentRef = useRef(null);

    const [hoverRef, isHovered] = useHover<HTMLDivElement>();
    const { isFocused } = useSetFocus({ ref: componentRef });

    const mergedRef = useMergeRef<HTMLDivElement>(ref, componentRef, hoverRef);

    const overrideClassName = cx(styles.chips, className, {
      [styles.disabled]: disabled,
      [styles.noAnimation]: noAnimation,
      [styles.withUserSelect]: allowTextSelection,
      [styles.border]: showBorder
    });
    const clickableClassName = cx(styles.clickable, overrideClassName, {
      [styles.disabled]: disabled,
      [styles.disableTextSelection]: !allowTextSelection
    });

    const backgroundColorStyle = useMemo(() => {
      let cssVar;
      if (disabled) {
        cssVar = getCSSVar("disabled-background-color");
      } else if (hasClickableWrapper && (isHovered || isFocused)) {
        cssVar = getElementColor(color, true, true);
      } else {
        cssVar = getElementColor(color, true);
      }
      return { backgroundColor: cssVar };
    }, [disabled, hasClickableWrapper, isHovered, isFocused, color]);

    const onDeleteCallback = useCallback(
      (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        e.stopPropagation();
        if (onDelete) {
          onDelete(id, e);
        }
      },
      [id, onDelete]
    );

    const onClickCallback = useCallback(
      (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (onClick !== undefined && (e.target as HTMLElement) !== iconButtonRef.current) {
          e.preventDefault();
          onClick(e);
        }
      },
      [onClick]
    );

    const clickableProps = useClickableProps(
      {
        onClick: onClickCallback,
        onMouseDown,
        disabled,
        id,
        "data-testid": componentDataTestId,
        ariaLabel: overrideAriaLabel,
        ariaHidden: false,
        ariaHasPopup: false,
        ariaExpanded: false
      },
      mergedRef
    );
    const wrapperProps = hasClickableWrapper
      ? {
          ...clickableProps,
          ref: clickableProps.ref as RefObject<HTMLDivElement>,
          className: clickableClassName,
          style: backgroundColorStyle
        }
      : {
          className: overrideClassName,
          "aria-label": overrideAriaLabel,
          style: backgroundColorStyle,
          ref: mergedRef,
          onClick: onClickCallback,
          onMouseDown,
          id: id,
          "data-testid": componentDataTestId
        };

    const leftAvatarProps = leftAvatarType === "text" ? { text: leftAvatar } : { src: leftAvatar };
    const rightAvatarProps = leftAvatarType === "text" ? { text: rightAvatar } : { src: rightAvatar };

    return (
      <div {...wrapperProps}>
        {leftAvatar ? (
          <Avatar
            withoutBorder
            className={cx(styles.avatar, styles.left, avatarClassName)}
            customSize={CHIPS_AVATAR_SIZE}
            type={leftAvatarType}
            key={id}
            {...leftAvatarProps}
          />
        ) : null}
        {leftIcon ? (
          <Icon
            className={cx(styles.icon, styles.left, iconClassName)}
            iconType="font"
            icon={leftIcon}
            iconSize={iconSize}
            ignoreFocusStyle
          />
        ) : null}
        {leftRenderer && <div className={cx(styles.customRenderer, styles.left)}>{leftRenderer}</div>}
        <Text type="text2" className={styles.label}>
          {label}
        </Text>
        {rightIcon ? (
          <Icon
            className={cx(styles.icon, styles.right, iconClassName)}
            iconType="font"
            icon={rightIcon}
            iconSize={iconSize}
            ignoreFocusStyle
          />
        ) : null}
        {rightAvatar ? (
          <Avatar
            withoutBorder
            className={cx(styles.avatar, styles.right, avatarClassName)}
            customSize={CHIPS_AVATAR_SIZE}
            type={rightAvatarType}
            key={id}
            {...rightAvatarProps}
          />
        ) : null}
        {rightRenderer && <div className={cx(styles.customRenderer, styles.right)}>{rightRenderer}</div>}
        {hasCloseButton && (
          <IconButton
            size="xxs"
            color="on-primary-color"
            className={cx(styles.icon, styles.close)}
            ariaLabel={closeButtonAriaLabel}
            hideTooltip
            icon={CloseSmall}
            onClick={onDeleteCallback}
            data-testid={`${componentDataTestId}-close`}
            ref={iconButtonRef}
          />
        )}
      </div>
    );
  }
);

export default withStaticProps(Chips, {
  colors: ElementAllowedColorEnum,
  avatarTypes: AvatarTypeEnum
});
